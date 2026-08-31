"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addDays,
  isSameDay,
  parseISO,
  addWeeks,
  subWeeks,
} from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Search,
  Plus,
  LogOut,
  CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  List,
  Grid3X3,
  CalendarIcon as CalendarViewIcon,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import AuthGuard from "@/components/auth-guard"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

// Types
interface Appointment {
  id: string
  patientName: string
  patientId: string
  doctorName: string
  doctorId: string
  department: string
  date: string
  time: string
  duration: string
  status: string
  type: string
  reason?: string
  notes?: string
  room?: string
  color?: string
}

interface Doctor {
  id: string
  name: string
  department: string
  specialization: string
  availability: {
    days: string[]
    startTime: string
    endTime: string
  }
  avatar?: string
}

interface TimeSlot {
  time: string
  available: boolean
  appointments?: Appointment[]
}

export default function AppointmentsPage() {
  return (
    <AuthGuard allowedRoles={["doctor", "nurse", "admin", "receptionist"]}>
      <AppointmentsManagement />
    </AuthGuard>
  )
}

function AppointmentsManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddAppointmentDialogOpen, setIsAddAppointmentDialogOpen] = useState(false)
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "calendar" | "day" | "week">("list")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date())
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [bulkSelectMode, setBulkSelectMode] = useState(false)
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([])

  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    patientName: "",
    doctorId: "",
    doctorName: "",
    department: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    duration: "30 minutes",
    type: "",
    reason: "",
    notes: "",
    room: "",
  })

  // Sample appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "a1",
      patientName: "John Doe",
      patientId: "P001",
      doctorName: "Dr. Sarah Smith",
      doctorId: "D001",
      department: "Cardiology",
      date: "2023-05-15",
      time: "10:30",
      duration: "30 minutes",
      status: "Confirmed",
      type: "Follow-up",
      reason: "Follow-up for hypertension management",
      room: "Room 101",
      color: "#4f46e5",
    },
    {
      id: "a2",
      patientName: "Jane Smith",
      patientId: "P002",
      doctorName: "Dr. Williams",
      doctorId: "D002",
      department: "Gynecology",
      date: "2023-06-15",
      time: "14:00",
      duration: "45 minutes",
      status: "Scheduled",
      type: "Regular Checkup",
      reason: "Prenatal checkup - second trimester",
      room: "Room 205",
      color: "#0891b2",
    },
    {
      id: "a3",
      patientName: "Robert Johnson",
      patientId: "P003",
      doctorName: "Dr. Emily Chen",
      doctorId: "D003",
      department: "Orthopedics",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "09:15",
      duration: "60 minutes",
      status: "Completed",
      type: "Post-Surgery",
      room: "Room 302",
      color: "#059669",
    },
    {
      id: "a4",
      patientName: "Maria Garcia",
      patientId: "P004",
      doctorName: "Dr. James Wilson",
      doctorId: "D004",
      department: "Neurology",
      date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
      time: "11:45",
      duration: "30 minutes",
      status: "Cancelled",
      type: "Initial Consultation",
      room: "Room 104",
      color: "#dc2626",
    },
    {
      id: "a5",
      patientName: "David Lee",
      patientId: "P005",
      doctorName: "Dr. Sarah Smith",
      doctorId: "D001",
      department: "Cardiology",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "13:30",
      duration: "30 minutes",
      status: "Confirmed",
      type: "Follow-up",
      room: "Room 101",
      color: "#4f46e5",
    },
    {
      id: "a6",
      patientName: "Linda Brown",
      patientId: "P006",
      doctorName: "Dr. Emily Chen",
      doctorId: "D003",
      department: "Orthopedics",
      date: format(addDays(new Date(), 2), "yyyy-MM-dd"),
      time: "10:00",
      duration: "45 minutes",
      status: "Scheduled",
      type: "Initial Consultation",
      room: "Room 303",
      color: "#059669",
    },
    {
      id: "a7",
      patientName: "Michael Wilson",
      patientId: "P007",
      doctorName: "Dr. James Wilson",
      doctorId: "D004",
      department: "Neurology",
      date: format(addDays(new Date(), -1), "yyyy-MM-dd"),
      time: "15:15",
      duration: "30 minutes",
      status: "No-Show",
      type: "Follow-up",
      room: "Room 105",
      color: "#dc2626",
    },
    {
      id: "a8",
      patientName: "Sarah Johnson",
      patientId: "P008",
      doctorName: "Dr. Williams",
      doctorId: "D002",
      department: "Gynecology",
      date: format(addDays(new Date(), 3), "yyyy-MM-dd"),
      time: "09:30",
      duration: "60 minutes",
      status: "Confirmed",
      type: "Procedure",
      room: "Room 206",
      color: "#0891b2",
    },
  ])

  // Sample doctors data
  const doctors: Doctor[] = [
    {
      id: "D001",
      name: "Dr. Sarah Smith",
      department: "Cardiology",
      specialization: "Interventional Cardiology",
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        startTime: "09:00",
        endTime: "17:00",
      },
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "D002",
      name: "Dr. Williams",
      department: "Gynecology",
      specialization: "Obstetrics and Gynecology",
      availability: {
        days: ["Monday", "Wednesday", "Friday"],
        startTime: "08:00",
        endTime: "16:00",
      },
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "D003",
      name: "Dr. Emily Chen",
      department: "Orthopedics",
      specialization: "Sports Medicine",
      availability: {
        days: ["Tuesday", "Thursday", "Friday"],
        startTime: "09:00",
        endTime: "18:00",
      },
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "D004",
      name: "Dr. James Wilson",
      department: "Neurology",
      specialization: "Neurological Surgery",
      availability: {
        days: ["Monday", "Tuesday", "Thursday", "Friday"],
        startTime: "08:30",
        endTime: "17:30",
      },
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Load appointments from localStorage on component mount
  useEffect(() => {
    const storedAppointments = localStorage.getItem("hms_appointments")
    if (storedAppointments) {
      try {
        setAppointments(JSON.parse(storedAppointments))
      } catch (error) {
        console.error("Error parsing stored appointments:", error)
      }
    }
  }, [])

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("hms_appointments", JSON.stringify(appointments))
  }, [appointments])

  // Reset bulk selection when view mode changes
  useEffect(() => {
    setBulkSelectMode(false)
    setSelectedAppointments([])
  }, [viewMode])

  // Generate time slots for the selected date
  const generateTimeSlots = (date: string, doctorId = "all"): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const startHour = 8
    const endHour = 18

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

        const appointmentsAtTime = appointments.filter(
          (appointment) =>
            appointment.date === date &&
            appointment.time === timeString &&
            (doctorId === "all" || appointment.doctorId === doctorId) &&
            appointment.status !== "Cancelled" &&
            appointment.status !== "No-Show",
        )

        slots.push({
          time: timeString,
          available:
            appointmentsAtTime.length === 0 ||
            (doctorId !== "all" && !appointmentsAtTime.some((a) => a.doctorId === doctorId)),
          appointments: appointmentsAtTime,
        })
      }
    }

    return slots
  }

  // Get days of the current week
  const daysOfWeek = useMemo(() => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Start on Monday
    const end = endOfWeek(currentWeek, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [currentWeek])

  // Filter appointments based on search query and filters
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      // Search filter
      const matchesSearch =
        appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.status.toLowerCase().includes(searchQuery.toLowerCase())

      // Doctor filter
      const matchesDoctor = selectedDoctor === "all" || appointment.doctorId === selectedDoctor

      // Department filter
      const matchesDepartment = selectedDepartment === "all" || appointment.department === selectedDepartment

      // Status filter
      const matchesStatus = selectedStatus === "all" || appointment.status === selectedStatus

      return matchesSearch && matchesDoctor && matchesDepartment && matchesStatus
    })
  }, [appointments, searchQuery, selectedDoctor, selectedDepartment, selectedStatus])

  // Get today's appointments
  const todaysAppointments = useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd")
    return filteredAppointments.filter((appointment) => appointment.date === today)
  }, [filteredAppointments])

  // Get upcoming appointments (future dates)
  const upcomingAppointments = useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd")
    return filteredAppointments.filter((appointment) => appointment.date > today)
  }, [filteredAppointments])

  // Get appointments for the selected date
  const appointmentsForSelectedDate = useMemo(() => {
    const dateString = format(selectedDate, "yyyy-MM-dd")
    return filteredAppointments.filter((appointment) => appointment.date === dateString)
  }, [filteredAppointments, selectedDate])

  // Get appointments for the current week
  const appointmentsForCurrentWeek = useMemo(() => {
    return filteredAppointments.filter((appointment) => {
      const appointmentDate = parseISO(appointment.date)
      return daysOfWeek.some((day) => isSameDay(day, appointmentDate))
    })
  }, [filteredAppointments, daysOfWeek])

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("hms_user")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/login")
  }

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Handle view appointment
  const handleViewAppointment = (appointmentId: string) => {
    router.push(`/appointments/${appointmentId}`)
  }

  // Handle input change for new appointment
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewAppointment((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select change for new appointment
  const handleSelectChange = (name: string, value: string) => {
    setNewAppointment((prev) => ({ ...prev, [name]: value }))

    // Auto-fill department based on doctor selection
    if (name === "doctorId") {
      const selectedDoctor = doctors.find((doctor) => doctor.id === value)
      if (selectedDoctor) {
        setNewAppointment((prev) => ({
          ...prev,
          doctorName: selectedDoctor.name,
          department: selectedDoctor.department,
        }))
      }
    }
  }

  // Open add appointment dialog
  const openAddAppointmentDialog = () => {
    setNewAppointment({
      ...newAppointment,
      date: format(selectedDate, "yyyy-MM-dd"),
    })
    setIsAddAppointmentDialogOpen(true)
  }

  // Handle add appointment
  const handleAddAppointment = () => {
    // Validate required fields
    if (!newAppointment.patientName || !newAppointment.doctorName || !newAppointment.date || !newAppointment.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Patient, Doctor, Date, Time)",
        variant: "destructive",
      })
      return
    }

    // Check for conflicts
    const timeSlots = generateTimeSlots(newAppointment.date, newAppointment.doctorId)
    const selectedTimeSlot = timeSlots.find((slot) => slot.time === newAppointment.time)

    if (selectedTimeSlot && !selectedTimeSlot.available) {
      toast({
        title: "Time Slot Not Available",
        description: "The selected time slot is already booked. Please choose another time.",
        variant: "destructive",
      })
      return
    }

    // Generate a new appointment ID
    const newId = `a${appointments.length + 1}`

    // Create new appointment object
    const appointment: Appointment = {
      id: newId,
      patientName: newAppointment.patientName,
      patientId: newAppointment.patientId || "Unknown",
      doctorName: newAppointment.doctorName,
      doctorId: newAppointment.doctorId,
      department: newAppointment.department || "General",
      date: newAppointment.date,
      time: newAppointment.time,
      duration: newAppointment.duration,
      status: "Scheduled",
      type: newAppointment.type || "Regular Checkup",
      reason: newAppointment.reason,
      notes: newAppointment.notes,
      room: newAppointment.room || "To be assigned",
      color: getColorForDepartment(newAppointment.department),
    }

    // Add to appointments array
    const updatedAppointments = [...appointments, appointment]
    setAppointments(updatedAppointments)

    // Save to localStorage
    localStorage.setItem("hms_appointments", JSON.stringify(updatedAppointments))

    // Show success message
    toast({
      title: "Appointment Added",
      description: `Appointment for ${appointment.patientName} with ${appointment.doctorName} has been scheduled`,
    })

    // Reset form and close dialog
    setNewAppointment({
      patientId: "",
      patientName: "",
      doctorId: "",
      doctorName: "",
      department: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "",
      duration: "30 minutes",
      type: "",
      reason: "",
      notes: "",
      room: "",
    })
    setIsAddAppointmentDialogOpen(false)
  }

  // Open reschedule dialog
  const openRescheduleDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setNewAppointment({
      ...newAppointment,
      date: appointment.date,
      time: appointment.time,
      doctorId: appointment.doctorId,
      doctorName: appointment.doctorName,
    })
    setIsRescheduleDialogOpen(true)
  }

  // Handle reschedule appointment
  const handleRescheduleAppointment = () => {
    if (!selectedAppointment) return

    // Check for conflicts
    const timeSlots = generateTimeSlots(newAppointment.date, newAppointment.doctorId)
    const selectedTimeSlot = timeSlots.find((slot) => slot.time === newAppointment.time)

    if (
      selectedTimeSlot &&
      !selectedTimeSlot.available &&
      !(selectedAppointment.date === newAppointment.date && selectedAppointment.time === newAppointment.time)
    ) {
      toast({
        title: "Time Slot Not Available",
        description: "The selected time slot is already booked. Please choose another time.",
        variant: "destructive",
      })
      return
    }

    // Update the appointment
    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === selectedAppointment.id) {
        return {
          ...appointment,
          date: newAppointment.date,
          time: newAppointment.time,
          status: "Rescheduled",
          doctorId: newAppointment.doctorId,
          doctorName: newAppointment.doctorName,
          department: newAppointment.department || appointment.department,
        }
      }
      return appointment
    })

    setAppointments(updatedAppointments)
    localStorage.setItem("hms_appointments", JSON.stringify(updatedAppointments))

    toast({
      title: "Appointment Rescheduled",
      description: `Appointment for ${selectedAppointment.patientName} has been rescheduled`,
    })

    setIsRescheduleDialogOpen(false)
    setSelectedAppointment(null)
  }

  // Open cancel dialog
  const openCancelDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsCancelDialogOpen(true)
  }

  // Handle cancel appointment
  const handleCancelAppointment = () => {
    if (!selectedAppointment) return

    // Update the appointment status
    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === selectedAppointment.id) {
        return {
          ...appointment,
          status: "Cancelled",
        }
      }
      return appointment
    })

    setAppointments(updatedAppointments)
    localStorage.setItem("hms_appointments", JSON.stringify(updatedAppointments))

    toast({
      title: "Appointment Cancelled",
      description: `Appointment for ${selectedAppointment.patientName} has been cancelled`,
      variant: "destructive",
    })

    setIsCancelDialogOpen(false)
    setSelectedAppointment(null)
  }

  // Handle bulk selection toggle
  const handleBulkSelectToggle = () => {
    setBulkSelectMode(!bulkSelectMode)
    setSelectedAppointments([])
  }

  // Handle appointment selection for bulk actions
  const handleAppointmentSelection = (appointmentId: string) => {
    setSelectedAppointments((prev) => {
      if (prev.includes(appointmentId)) {
        return prev.filter((id) => id !== appointmentId)
      } else {
        return [...prev, appointmentId]
      }
    })
  }

  // Handle bulk cancel
  const handleBulkCancel = () => {
    if (selectedAppointments.length === 0) return

    // Update the appointment status for selected appointments
    const updatedAppointments = appointments.map((appointment) => {
      if (selectedAppointments.includes(appointment.id)) {
        return {
          ...appointment,
          status: "Cancelled",
        }
      }
      return appointment
    })

    setAppointments(updatedAppointments)
    localStorage.setItem("hms_appointments", JSON.stringify(updatedAppointments))

    toast({
      title: "Appointments Cancelled",
      description: `${selectedAppointments.length} appointments have been cancelled`,
      variant: "destructive",
    })

    setBulkSelectMode(false)
    setSelectedAppointments([])
  }

  // Handle confirm appointment
  const handleConfirmAppointment = (appointmentId: string) => {
    // Update the appointment status
    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === appointmentId) {
        return {
          ...appointment,
          status: "Confirmed",
        }
      }
      return appointment
    })

    setAppointments(updatedAppointments)
    localStorage.setItem("hms_appointments", JSON.stringify(updatedAppointments))

    toast({
      title: "Appointment Confirmed",
      description: `Appointment has been confirmed`,
    })
  }

  // Handle mark as completed
  const handleMarkAsCompleted = (appointmentId: string) => {
    // Update the appointment status
    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === appointmentId) {
        return {
          ...appointment,
          status: "Completed",
        }
      }
      return appointment
    })

    setAppointments(updatedAppointments)
    localStorage.setItem("hms_appointments", JSON.stringify(updatedAppointments))

    toast({
      title: "Appointment Completed",
      description: `Appointment has been marked as completed`,
    })
  }

  // Handle mark as no-show
  const handleMarkAsNoShow = (appointmentId: string) => {
    // Update the appointment status
    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === appointmentId) {
        return {
          ...appointment,
          status: "No-Show",
        }
      }
      return appointment
    })

    setAppointments(updatedAppointments)
    localStorage.setItem("hms_appointments", JSON.stringify(updatedAppointments))

    toast({
      title: "No-Show Recorded",
      description: `Appointment has been marked as no-show`,
      variant: "destructive",
    })
  }

  // Get color for department
  const getColorForDepartment = (department: string): string => {
    const colors: Record<string, string> = {
      Cardiology: "#4f46e5",
      Gynecology: "#0891b2",
      Orthopedics: "#059669",
      Neurology: "#dc2626",
      Pediatrics: "#d97706",
      Dermatology: "#7c3aed",
      "General Medicine": "#2563eb",
    }

    return colors[department] || "#6b7280"
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Scheduled</Badge>
      case "Confirmed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      case "No-Show":
        return <Badge className="bg-red-100 text-red-800 border-red-200">No-Show</Badge>
      case "Rescheduled":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Rescheduled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  // Navigate to previous week
  const goToPrevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1))
  }

  // Go to today
  const goToToday = () => {
    setSelectedDate(new Date())
    setCurrentWeek(new Date())
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 shadow-subtle">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="relative h-8 w-8 mr-2">
            <Image src="/images/logo.png" alt="Helwan National University Hospital" fill className="object-contain" />
          </div>
          <span className="text-primary">Helwan National University Hospital</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm">
            Help
          </Button>
          <Button size="sm">Staff</Button>
          <Button size="sm" variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Appointments</h1>
          <div className="flex items-center gap-2">
            {bulkSelectMode ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkCancel}
                  disabled={selectedAppointments.length === 0}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel Selected ({selectedAppointments.length})
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkSelectToggle}>
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleBulkSelectToggle}>
                  Select Multiple
                </Button>
                <Button onClick={openAddAppointmentDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Appointment
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-xs text-muted-foreground">All scheduled appointments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaysAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Appointments scheduled for today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Future scheduled appointments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Appointments</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.filter((a) => a.status === "Completed").length}</div>
              <p className="text-xs text-muted-foreground">Successfully completed appointments</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search appointments..."
                  className="w-full bg-background pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>

              <div className="flex gap-2">
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Doctors</SelectItem>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Gynecology">Gynecology</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                    <SelectItem value="General Medicine">General Medicine</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="No-Show">No-Show</SelectItem>
                    <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
              <Button variant={viewMode === "day" ? "default" : "outline"} size="sm" onClick={() => setViewMode("day")}>
                <CalendarIcon className="h-4 w-4 mr-1" />
                Day
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Week
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("calendar")}
              >
                <CalendarViewIcon className="h-4 w-4 mr-1" />
                Month
              </Button>
            </div>
          </div>

          {viewMode === "list" && (
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Appointments</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="border-none p-0 pt-4">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {bulkSelectMode && <TableHead className="w-[50px]">Select</TableHead>}
                          <TableHead>Patient</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAppointments.length > 0 ? (
                          filteredAppointments.map((appointment) => (
                            <TableRow key={appointment.id}>
                              {bulkSelectMode && (
                                <TableCell>
                                  <Checkbox
                                    checked={selectedAppointments.includes(appointment.id)}
                                    onCheckedChange={() => handleAppointmentSelection(appointment.id)}
                                    disabled={appointment.status === "Completed" || appointment.status === "Cancelled"}
                                  />
                                </TableCell>
                              )}
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={`/placeholder.svg?height=32&width=32`}
                                      alt={appointment.patientName}
                                    />
                                    <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{appointment.patientName}</div>
                                    <div className="text-xs text-muted-foreground">ID: {appointment.patientId}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{appointment.doctorName}</TableCell>
                              <TableCell>{appointment.department}</TableCell>
                              <TableCell>{appointment.date}</TableCell>
                              <TableCell>{appointment.time}</TableCell>
                              <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {appointment.status === "Scheduled" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleConfirmAppointment(appointment.id)}
                                    >
                                      Confirm
                                    </Button>
                                  )}
                                  {(appointment.status === "Scheduled" || appointment.status === "Confirmed") && (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openRescheduleDialog(appointment)}
                                      >
                                        Reschedule
                                      </Button>
                                      <Button variant="ghost" size="sm" onClick={() => openCancelDialog(appointment)}>
                                        Cancel
                                      </Button>
                                    </>
                                  )}
                                  {appointment.status === "Confirmed" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleMarkAsCompleted(appointment.id)}
                                    >
                                      Complete
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewAppointment(appointment.id)}
                                  >
                                    View
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={bulkSelectMode ? 8 : 7} className="text-center py-4">
                              No appointments found. Please add a new appointment.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t p-4">
                    <div className="text-xs text-muted-foreground">
                      Showing {filteredAppointments.length} of {appointments.length} appointments
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="today" className="border-none p-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Appointments</CardTitle>
                    <CardDescription>Appointments scheduled for today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {todaysAppointments.length > 0 ? (
                      <div className="space-y-4">
                        {todaysAppointments.map((appointment) => (
                          <div key={appointment.id} className="flex items-center justify-between border-b pb-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={`/placeholder.svg?height=40&width=40`}
                                  alt={appointment.patientName}
                                />
                                <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{appointment.patientName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.time} - {appointment.doctorName}
                                </p>
                                <div className="mt-1">{getStatusBadge(appointment.status)}</div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {appointment.status === "Scheduled" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleConfirmAppointment(appointment.id)}
                                >
                                  Confirm
                                </Button>
                              )}
                              {appointment.status === "Confirmed" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkAsCompleted(appointment.id)}
                                >
                                  Complete
                                </Button>
                              )}
                              <Button variant="outline" size="sm" onClick={() => handleViewAppointment(appointment.id)}>
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No appointments scheduled for today.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upcoming" className="border-none p-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>Future scheduled appointments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingAppointments.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                          <div key={appointment.id} className="flex items-center justify-between border-b pb-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={`/placeholder.svg?height=40&width=40`}
                                  alt={appointment.patientName}
                                />
                                <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{appointment.patientName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.date} at {appointment.time} - {appointment.doctorName}
                                </p>
                                <div className="mt-1">{getStatusBadge(appointment.status)}</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleViewAppointment(appointment.id)}>
                              View Details
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No upcoming appointments scheduled.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="completed" className="border-none p-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Completed Appointments</CardTitle>
                    <CardDescription>Successfully completed appointments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {appointments.filter((a) => a.status === "Completed").length > 0 ? (
                      <div className="space-y-4">
                        {appointments
                          .filter((a) => a.status === "Completed")
                          .map((appointment) => (
                            <div key={appointment.id} className="flex items-center justify-between border-b pb-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={`/placeholder.svg?height=40&width=40`}
                                    alt={appointment.patientName}
                                  />
                                  <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{appointment.patientName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {appointment.date} at {appointment.time} - {appointment.doctorName}
                                  </p>
                                  <div className="mt-1">{getStatusBadge(appointment.status)}</div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => handleViewAppointment(appointment.id)}>
                                View Details
                              </Button>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No completed appointments.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {viewMode === "day" && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Daily Schedule: {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedDate(addDays(selectedDate, -1))}>
                      <ChevronLeft className="h-4 w-4" />
                      Previous Day
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToToday}>
                      Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
                      Next Day
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>{appointmentsForSelectedDate.length} appointments scheduled</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {generateTimeSlots(format(selectedDate, "yyyy-MM-dd")).map((slot, index) => (
                    <div
                      key={index}
                      className={cn(
                        "grid grid-cols-[80px_1fr] gap-2 py-2 px-3 rounded-md",
                        slot.appointments && slot.appointments.length > 0 ? "bg-gray-50" : "",
                      )}
                    >
                      <div className="text-sm font-medium text-gray-500">{slot.time}</div>
                      <div className="space-y-2">
                        {slot.appointments && slot.appointments.length > 0 ? (
                          slot.appointments.map((appointment) => (
                            <div
                              key={appointment.id}
                              className="flex items-center justify-between p-2 rounded-md"
                              style={{
                                backgroundColor: `${appointment.color}20`,
                                borderLeft: `3px solid ${appointment.color}`,
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={`/placeholder.svg?height=32&width=32`}
                                    alt={appointment.patientName}
                                  />
                                  <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{appointment.patientName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {appointment.doctorName} - {appointment.department}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(appointment.status)}
                                <Button variant="ghost" size="sm" onClick={() => handleViewAppointment(appointment.id)}>
                                  View
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div
                            className="flex items-center justify-center h-10 border border-dashed border-gray-200 rounded-md cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              setNewAppointment({
                                ...newAppointment,
                                date: format(selectedDate, "yyyy-MM-dd"),
                                time: slot.time,
                              })
                              setIsAddAppointmentDialogOpen(true)
                            }}
                          >
                            <p className="text-sm text-muted-foreground">Available - Click to schedule</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === "week" && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Weekly Schedule: {format(daysOfWeek[0], "MMM d")} - {format(daysOfWeek[6], "MMM d, yyyy")}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={goToPrevWeek}>
                      <ChevronLeft className="h-4 w-4" />
                      Previous Week
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToToday}>
                      This Week
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToNextWeek}>
                      Next Week
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>{appointmentsForCurrentWeek.length} appointments scheduled this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {daysOfWeek.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-sm font-medium">{format(day, "EEE")}</div>
                      <div
                        className={cn(
                          "text-sm rounded-full w-8 h-8 flex items-center justify-center mx-auto mt-1 cursor-pointer",
                          isSameDay(day, new Date()) ? "bg-primary text-primary-foreground" : "",
                          isSameDay(day, selectedDate) && !isSameDay(day, new Date()) ? "bg-gray-100" : "",
                        )}
                        onClick={() => setSelectedDate(day)}
                      >
                        {format(day, "d")}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2 mt-4">
                  {daysOfWeek.map((day, dayIndex) => (
                    <div key={dayIndex} className="min-h-[400px] border rounded-md p-2">
                      <div className="text-sm font-medium mb-2 text-center">{format(day, "MMM d")}</div>
                      <div className="space-y-2">
                        {appointments
                          .filter((appointment) => appointment.date === format(day, "yyyy-MM-dd"))
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map((appointment) => (
                            <div
                              key={appointment.id}
                              className="p-2 rounded-md text-xs cursor-pointer"
                              style={{
                                backgroundColor: `${appointment.color}20`,
                                borderLeft: `3px solid ${appointment.color}`,
                              }}
                              onClick={() => handleViewAppointment(appointment.id)}
                            >
                              <div className="font-medium truncate">{appointment.patientName}</div>
                              <div className="text-muted-foreground truncate">
                                {appointment.time} - {appointment.doctorName}
                              </div>
                              <div className="mt-1">{getStatusBadge(appointment.status)}</div>
                            </div>
                          ))}

                        <div
                          className="flex items-center justify-center h-8 border border-dashed border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 mt-2"
                          onClick={() => {
                            setNewAppointment({
                              ...newAppointment,
                              date: format(day, "yyyy-MM-dd"),
                            })
                            setIsAddAppointmentDialogOpen(true)
                          }}
                        >
                          <Plus className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === "calendar" && (
            <Card>
              <CardHeader>
                <CardTitle>Monthly Calendar</CardTitle>
                <CardDescription>View and manage appointments by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                    disabled={(date) => date < new Date("1900-01-01")}
                  />
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Appointments for {format(selectedDate, "MMMM d, yyyy")}</h3>

                  {appointmentsForSelectedDate.length > 0 ? (
                    <div className="space-y-4">
                      {appointmentsForSelectedDate
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-3 rounded-md"
                            style={{
                              backgroundColor: `${appointment.color}10`,
                              borderLeft: `3px solid ${appointment.color}`,
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={`/placeholder.svg?height=40&width=40`}
                                  alt={appointment.patientName}
                                />
                                <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{appointment.patientName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.time} - {appointment.doctorName} ({appointment.department})
                                </p>
                                <div className="mt-1">{getStatusBadge(appointment.status)}</div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {appointment.status === "Scheduled" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleConfirmAppointment(appointment.id)}
                                >
                                  Confirm
                                </Button>
                              )}
                              <Button variant="outline" size="sm" onClick={() => handleViewAppointment(appointment.id)}>
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed rounded-md">
                      <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Appointments</h3>
                      <p className="text-gray-500 mb-4">There are no appointments scheduled for this date.</p>
                      <Button
                        onClick={() => {
                          setNewAppointment({
                            ...newAppointment,
                            date: format(selectedDate, "yyyy-MM-dd"),
                          })
                          setIsAddAppointmentDialogOpen(true)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Appointment
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Add Appointment Dialog */}
      <Dialog open={isAddAppointmentDialogOpen} onOpenChange={setIsAddAppointmentDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Appointment</DialogTitle>
            <DialogDescription>Schedule a new appointment for a patient.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">
                Patient Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="patientName"
                name="patientName"
                value={newAppointment.patientName}
                onChange={handleInputChange}
                placeholder="e.g., John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input
                id="patientId"
                name="patientId"
                value={newAppointment.patientId}
                onChange={handleInputChange}
                placeholder="e.g., P-2023-0584"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctorId">
                Doctor <span className="text-destructive">*</span>
              </Label>
              <Select
                value={newAppointment.doctorId}
                onValueChange={(value) => handleSelectChange("doctorId", value)}
                required
              >
                <SelectTrigger id="doctorId">
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newAppointment.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newAppointment.date ? format(new Date(newAppointment.date), "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newAppointment.date ? new Date(newAppointment.date) : undefined}
                      onSelect={(date) =>
                        date &&
                        handleInputChange({
                          target: { name: "date", value: format(date, "yyyy-MM-dd") },
                        } as React.ChangeEvent<HTMLInputElement>)
                      }
                      initialFocus
                      disabled={(date) => date < new Date("1900-01-01")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">
                  Time <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={newAppointment.time}
                  onValueChange={(value) => handleSelectChange("time", value)}
                  required
                >
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateTimeSlots(newAppointment.date, newAppointment.doctorId).map((slot, index) => (
                      <SelectItem key={index} value={slot.time} disabled={!slot.available}>
                        {slot.time} {!slot.available && "(Unavailable)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={newAppointment.duration} onValueChange={(value) => handleSelectChange("duration", value)}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15 minutes">15 minutes</SelectItem>
                  <SelectItem value="30 minutes">30 minutes</SelectItem>
                  <SelectItem value="45 minutes">45 minutes</SelectItem>
                  <SelectItem value="60 minutes">60 minutes</SelectItem>
                  <SelectItem value="90 minutes">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Appointment Type</Label>
              <Select value={newAppointment.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regular Checkup">Regular Checkup</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Initial Consultation">Initial Consultation</SelectItem>
                  <SelectItem value="Procedure">Procedure</SelectItem>
                  <SelectItem value="Post-Surgery">Post-Surgery</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                name="room"
                value={newAppointment.room}
                onChange={handleInputChange}
                placeholder="e.g., Room 101"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Textarea
                id="reason"
                name="reason"
                value={newAppointment.reason}
                onChange={handleInputChange}
                placeholder="Reason for the appointment"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={newAppointment.notes}
                onChange={handleInputChange}
                placeholder="Additional notes about the appointment"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAppointmentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAppointment}>Schedule Appointment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>Reschedule appointment for {selectedAppointment?.patientName}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reschedule-date">New Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newAppointment.date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newAppointment.date ? format(new Date(newAppointment.date), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newAppointment.date ? new Date(newAppointment.date) : undefined}
                    onSelect={(date) =>
                      date &&
                      handleInputChange({
                        target: { name: "date", value: format(date, "yyyy-MM-dd") },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                    initialFocus
                    disabled={(date) => date < new Date("1900-01-01")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reschedule-time">New Time</Label>
              <Select value={newAppointment.time} onValueChange={(value) => handleSelectChange("time", value)}>
                <SelectTrigger id="reschedule-time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeSlots(newAppointment.date, newAppointment.doctorId).map((slot, index) => (
                    <SelectItem
                      key={index}
                      value={slot.time}
                      disabled={
                        !slot.available &&
                        !(selectedAppointment?.time === slot.time && selectedAppointment?.date === newAppointment.date)
                      }
                    >
                      {slot.time}{" "}
                      {!slot.available &&
                        !(
                          selectedAppointment?.time === slot.time && selectedAppointment?.date === newAppointment.date
                        ) &&
                        "(Unavailable)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reschedule-doctor">Doctor</Label>
              <Select value={newAppointment.doctorId} onValueChange={(value) => handleSelectChange("doctorId", value)}>
                <SelectTrigger id="reschedule-doctor">
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRescheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRescheduleAppointment}>Reschedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>Are you sure you want to cancel this appointment?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedAppointment && (
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Patient:</span> {selectedAppointment.patientName}
                </p>
                <p>
                  <span className="font-medium">Doctor:</span> {selectedAppointment.doctorName}
                </p>
                <p>
                  <span className="font-medium">Date:</span> {selectedAppointment.date}
                </p>
                <p>
                  <span className="font-medium">Time:</span> {selectedAppointment.time}
                </p>
                <div className="mt-4 flex items-center">
                  <AlertCircle className="h-5 w-5 text-destructive mr-2" />
                  <p className="text-sm text-destructive">This action cannot be undone.</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Keep Appointment
            </Button>
            <Button variant="destructive" onClick={handleCancelAppointment}>
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
