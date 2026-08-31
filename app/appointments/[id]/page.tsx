"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Edit, Calendar, Clock, User, FileText, CheckCircle, X, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  reason: string
  notes?: string
  vitalSigns?: {
    bloodPressure: string
    heartRate: string
    temperature: string
    respiratoryRate: string
    oxygenSaturation: string
    weight: string
    height: string
  }
  diagnosis?: string
  prescription?: {
    id: string
    medication: string
    dosage: string
    frequency: string
    duration: string
    instructions: string
  }[]
  followUp?: {
    recommended: boolean
    date?: string
    reason?: string
  }
  history?: {
    timestamp: string
    action: string
    user: string
    notes?: string
  }[]
}

export default function AppointmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real application, this would be an API call
    // For now, we'll simulate fetching from localStorage or mock data
    const fetchAppointment = () => {
      setLoading(true)
      try {
        // Mock appointments data
        const mockAppointments: Appointment[] = [
          {
            id: "a1",
            patientName: "John Doe",
            patientId: "1",
            doctorName: "Dr. Sarah Smith",
            doctorId: "D001",
            department: "Cardiology",
            date: "2023-05-15",
            time: "10:30 AM",
            duration: "30 minutes",
            status: "Confirmed",
            type: "Follow-up",
            reason: "Follow-up for hypertension management",
            notes:
              "Patient has been compliant with medication. Blood pressure readings at home have improved but still occasionally elevated.",
            vitalSigns: {
              bloodPressure: "138/85 mmHg",
              heartRate: "72 bpm",
              temperature: "98.6°F (37°C)",
              respiratoryRate: "16 breaths/min",
              oxygenSaturation: "98%",
              weight: "185 lbs (84 kg)",
              height: "5'10\" (178 cm)",
            },
            diagnosis: "Essential (primary) hypertension, well-controlled",
            prescription: [
              {
                id: "rx-001",
                medication: "Lisinopril",
                dosage: "10mg",
                frequency: "Once daily",
                duration: "3 months",
                instructions: "Take in the morning with or without food",
              },
              {
                id: "rx-002",
                medication: "Hydrochlorothiazide",
                dosage: "12.5mg",
                frequency: "Once daily",
                duration: "3 months",
                instructions: "Take in the morning with food",
              },
            ],
            followUp: {
              recommended: true,
              date: "2023-08-15",
              reason: "Routine follow-up for blood pressure monitoring",
            },
            history: [
              {
                timestamp: "2023-04-01 09:15:30",
                action: "Appointment Scheduled",
                user: "Front Desk Staff",
                notes: "Patient requested follow-up appointment",
              },
              {
                timestamp: "2023-05-10 14:22:45",
                action: "Appointment Confirmed",
                user: "Automated System",
                notes: "Confirmation SMS sent to patient",
              },
              {
                timestamp: "2023-05-15 10:25:12",
                action: "Patient Checked In",
                user: "Reception Staff",
                notes: "Patient arrived 5 minutes early",
              },
            ],
          },
          {
            id: "a2",
            patientName: "Jane Smith",
            patientId: "2",
            doctorName: "Dr. Williams",
            doctorId: "D002",
            department: "Gynecology",
            date: "2023-06-15",
            time: "2:00 PM",
            duration: "45 minutes",
            status: "Scheduled",
            type: "Regular Checkup",
            reason: "Prenatal checkup - second trimester",
            notes: "Patient is in her second trimester, experiencing mild morning sickness.",
            vitalSigns: {
              bloodPressure: "118/75 mmHg",
              heartRate: "82 bpm",
              temperature: "98.2°F (36.8°C)",
              respiratoryRate: "18 breaths/min",
              oxygenSaturation: "99%",
              weight: "145 lbs (66 kg)",
              height: "5'6\" (168 cm)",
            },
            followUp: {
              recommended: true,
              date: "2023-07-15",
              reason: "Monthly prenatal checkup",
            },
            history: [
              {
                timestamp: "2023-05-20 11:30:00",
                action: "Appointment Scheduled",
                user: "Patient Portal",
                notes: "Patient scheduled via online portal",
              },
              {
                timestamp: "2023-06-10 09:15:30",
                action: "Appointment Reminder Sent",
                user: "Automated System",
                notes: "SMS reminder sent to patient",
              },
            ],
          },
        ]

        setTimeout(() => {
          const foundAppointment = mockAppointments.find((a) => a.id === params.id)
          setAppointment(foundAppointment || null)
          setLoading(false)
        }, 500) // Simulate network delay
      } catch (error) {
        console.error("Error fetching appointment:", error)
        toast({
          title: "Error",
          description: "Failed to load appointment data. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchAppointment()
  }, [params.id, toast])

  const handleEditAppointment = () => {
    toast({
      title: "Edit Appointment",
      description: `Editing appointment for: ${appointment?.patientName}`,
    })
    // In a real app, this would navigate to an edit form or open a modal
  }

  const handleBackToList = () => {
    router.push("/appointments")
  }

  const handleViewPatient = () => {
    router.push(`/patients/${appointment?.patientId}`)
  }

  const handleConfirmAppointment = () => {
    toast({
      title: "Appointment Confirmed",
      description: `Appointment for ${appointment?.patientName} has been confirmed.`,
    })
    // In a real app, this would update the appointment status
    setAppointment(appointment ? { ...appointment, status: "Confirmed" } : null)
  }

  const handleCancelAppointment = () => {
    toast({
      title: "Appointment Cancelled",
      description: `Appointment for ${appointment?.patientName} has been cancelled.`,
      variant: "destructive",
    })
    // In a real app, this would update the appointment status
    setAppointment(appointment ? { ...appointment, status: "Cancelled" } : null)
  }

  const handleRescheduleAppointment = () => {
    toast({
      title: "Reschedule Appointment",
      description: `Rescheduling appointment for: ${appointment?.patientName}`,
    })
    // In a real app, this would open a reschedule form
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Appointments
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Loading appointment information...</CardTitle>
            <CardDescription>Please wait while we fetch the appointment details.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-40 mb-2"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Appointments
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Appointment Not Found</CardTitle>
            <CardDescription>The requested appointment could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please return to the appointments list and select a valid appointment.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleBackToList}>Return to Appointments</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

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

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" onClick={handleBackToList}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Appointments
        </Button>
        <Button size="sm" onClick={handleEditAppointment}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Appointment Details</CardTitle>
                <CardDescription>
                  {appointment.date} at {appointment.time}
                </CardDescription>
              </div>
              <div>{getStatusBadge(appointment.status)}</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Patient Information</h3>
                <Separator className="my-2" />
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={appointment.patientName} />
                    <AvatarFallback>
                      {appointment.patientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{appointment.patientName}</p>
                    <p className="text-sm text-gray-500">Patient ID: {appointment.patientId}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={handleViewPatient}>
                  <User className="h-4 w-4 mr-2" />
                  View Patient Profile
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Doctor Information</h3>
                <Separator className="my-2" />
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={appointment.doctorName} />
                    <AvatarFallback>
                      {appointment.doctorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{appointment.doctorName}</p>
                    <p className="text-sm text-gray-500">{appointment.department}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Appointment Information</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Type:</div>
                  <div className="text-sm">{appointment.type}</div>
                  <div className="text-sm font-medium">Date:</div>
                  <div className="text-sm">{appointment.date}</div>
                  <div className="text-sm font-medium">Time:</div>
                  <div className="text-sm">{appointment.time}</div>
                  <div className="text-sm font-medium">Duration:</div>
                  <div className="text-sm">{appointment.duration}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Reason for Visit</h3>
                <Separator className="my-2" />
                <p className="text-sm">{appointment.reason}</p>
              </div>

              {appointment.status === "Scheduled" && (
                <div className="flex flex-col space-y-2">
                  <Button onClick={handleConfirmAppointment}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Appointment
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={handleRescheduleAppointment}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Reschedule
                    </Button>
                    <Button variant="destructive" onClick={handleCancelAppointment}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Clinical Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="summary">
                  <FileText className="h-4 w-4 mr-2" />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="vitals">
                  <Clock className="h-4 w-4 mr-2" />
                  Vital Signs
                </TabsTrigger>
                <TabsTrigger value="prescriptions">
                  <FileText className="h-4 w-4 mr-2" />
                  Prescriptions
                </TabsTrigger>
                <TabsTrigger value="history">
                  <Calendar className="h-4 w-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Clinical Notes</h3>
                  <Separator className="my-2" />
                  <p className="text-sm">{appointment.notes || "No clinical notes available."}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Diagnosis</h3>
                  <Separator className="my-2" />
                  <p className="text-sm">{appointment.diagnosis || "No diagnosis recorded."}</p>
                </div>

                {appointment.followUp && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Follow-up Recommendation</h3>
                    <Separator className="my-2" />
                    {appointment.followUp.recommended ? (
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Recommended Date:</span> {appointment.followUp.date}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Reason:</span> {appointment.followUp.reason}
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Follow-up
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm">No follow-up recommended at this time.</p>
                    )}
                  </div>
                )}

                <div className="flex justify-center mt-4">
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message to Patient
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="vitals" className="space-y-4">
                {appointment.vitalSigns ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Blood Pressure</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="text-2xl font-bold text-center">{appointment.vitalSigns.bloodPressure}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Heart Rate</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="text-2xl font-bold text-center">{appointment.vitalSigns.heartRate}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Temperature</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="text-2xl font-bold text-center">{appointment.vitalSigns.temperature}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Respiratory Rate</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="text-2xl font-bold text-center">{appointment.vitalSigns.respiratoryRate}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Oxygen Saturation</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="text-2xl font-bold text-center">{appointment.vitalSigns.oxygenSaturation}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Weight & Height</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="text-lg font-medium text-center">
                          {appointment.vitalSigns.weight} / {appointment.vitalSigns.height}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Vital Signs Recorded</h3>
                    <p className="text-gray-500">No vital signs have been recorded for this appointment.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="prescriptions" className="space-y-4">
                {appointment.prescription && appointment.prescription.length > 0 ? (
                  <div className="space-y-4">
                    {appointment.prescription.map((prescription) => (
                      <Card key={prescription.id}>
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">{prescription.medication}</CardTitle>
                            <Badge variant="outline">{prescription.dosage}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm font-medium">Frequency:</div>
                            <div className="text-sm">{prescription.frequency}</div>
                            <div className="text-sm font-medium">Duration:</div>
                            <div className="text-sm">{prescription.duration}</div>
                            <div className="text-sm font-medium">Instructions:</div>
                            <div className="text-sm">{prescription.instructions}</div>
                          </div>
                        </CardContent>
                        <CardFooter className="py-3">
                          <Button variant="outline" size="sm">
                            Print Prescription
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescriptions</h3>
                    <p className="text-gray-500">No prescriptions have been issued for this appointment.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                {appointment.history && appointment.history.length > 0 ? (
                  <div className="space-y-4">
                    {appointment.history.map((event, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                          <div className="rounded-full h-8 w-8 flex items-center justify-center bg-blue-100 text-blue-800">
                            <Calendar className="h-4 w-4" />
                          </div>
                          {index < appointment.history!.length - 1 && (
                            <div className="h-full w-0.5 bg-gray-200 mt-2"></div>
                          )}
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md w-full">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">{event.action}</p>
                            <p className="text-xs text-gray-500">{event.timestamp}</p>
                          </div>
                          <p className="text-xs text-gray-500">By: {event.user}</p>
                          {event.notes && <p className="text-sm mt-1">{event.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No History</h3>
                    <p className="text-gray-500">No history events have been recorded for this appointment.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
