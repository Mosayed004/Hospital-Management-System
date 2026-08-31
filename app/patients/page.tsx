"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Download, LogOut, FileText, Calendar, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import AuthGuard from "@/components/auth-guard"
import PatientRegistrationForm from "@/components/patient-registration-form"
import { Badge } from "@/components/ui/badge"

export default function PatientsPage() {
  return (
    <AuthGuard allowedRoles={["doctor", "nurse", "admin"]}>
      <PatientManagement />
    </AuthGuard>
  )
}

function PatientManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const patientsPerPage = 10

  useEffect(() => {
    // Load patients from localStorage if available
    const storedPatients = localStorage.getItem("hms_patients")
    if (storedPatients) {
      try {
        setPatients(JSON.parse(storedPatients))
      } catch (error) {
        console.error("Error parsing stored patients:", error)
        toast({
          title: "Error",
          description: "Failed to load patient data. Please try again.",
          variant: "destructive",
        })
      }
    }
    setLoading(false)
  }, [toast])

  const handleLogout = () => {
    localStorage.removeItem("hms_user")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/login")
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page on new search
  }

  const handleFilterChange = (status: string) => {
    setFilterStatus(status)
    setCurrentPage(1) // Reset to first page on new filter
  }

  const handleDownload = () => {
    try {
      // Create CSV content
      let csvContent = "ID,Name,Date of Birth,Gender,Contact,Address,Last Visit,Status\n"

      filteredPatients.forEach((patient) => {
        csvContent += `${patient.id},${patient.name},${patient.dateOfBirth},"${patient.gender || ""}","${patient.contact || ""}","${patient.address || ""}",${patient.lastVisit || ""},"${patient.status || "Active"}"\n`
      })

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `patients_${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download Complete",
        description: "Patient data has been downloaded as CSV",
      })
    } catch (error) {
      console.error("Error downloading patient data:", error)
      toast({
        title: "Download Failed",
        description: "There was an error downloading the patient data.",
        variant: "destructive",
      })
    }
  }

  const handleViewPatient = (patientId: string) => {
    router.push(`/patients/${patientId}`)
  }

  // Filter patients based on search query and status filter
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.contact?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterStatus === "all") return matchesSearch
    return matchesSearch && patient.status?.toLowerCase() === filterStatus.toLowerCase()
  })

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient)
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage)

  // Get active patients count
  const activePatients = patients.filter((patient) => patient.status?.toLowerCase() === "active").length

  // Get recent patients (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recentPatients = patients.filter((patient) => {
    if (!patient.registrationDate && !patient.lastVisit) return false

    const registrationDate = patient.registrationDate ? new Date(patient.registrationDate) : null
    const lastVisit = patient.lastVisit ? new Date(patient.lastVisit) : null

    return (registrationDate && registrationDate >= thirtyDaysAgo) || (lastVisit && lastVisit >= thirtyDaysAgo)
  }).length

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
          <h1 className="text-2xl font-bold">Patient Management</h1>
          <PatientRegistrationForm />
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search patients..."
                  className="w-full bg-background pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleFilterChange(filterStatus === "all" ? "active" : "all")}
              >
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </div>
            <Tabs defaultValue="all" onValueChange={(value) => handleFilterChange(value)}>
              <TabsList>
                <TabsTrigger value="all">All Patients</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="border-none p-0 pt-4">
                <Card>
                  <CardContent className="p-0">
                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Patient ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Date of Birth</TableHead>
                            <TableHead className="hidden md:table-cell">Contact</TableHead>
                            <TableHead className="hidden lg:table-cell">Address</TableHead>
                            <TableHead className="hidden md:table-cell">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentPatients.length > 0 ? (
                            currentPatients.map((patient) => (
                              <TableRow key={patient.id}>
                                <TableCell>{patient.id}</TableCell>
                                <TableCell>{patient.name}</TableCell>
                                <TableCell className="hidden md:table-cell">{patient.dateOfBirth}</TableCell>
                                <TableCell className="hidden md:table-cell">{patient.contact || "N/A"}</TableCell>
                                <TableCell className="hidden lg:table-cell">{patient.address}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <Badge variant={patient.status === "Active" ? "default" : "secondary"}>
                                    {patient.status || "Active"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm" onClick={() => handleViewPatient(patient.id)}>
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-4">
                                {filteredPatients.length === 0 ? (
                                  <>
                                    <User className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                    <p>No patients found. Please register a new patient.</p>
                                  </>
                                ) : (
                                  <p>No patients match your search criteria.</p>
                                )}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t p-4">
                    <div className="text-xs text-muted-foreground">
                      Showing {currentPatients.length > 0 ? indexOfFirstPatient + 1 : 0} to{" "}
                      {Math.min(indexOfLastPatient, filteredPatients.length)} of {filteredPatients.length} patients
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1 || filteredPatients.length === 0}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages || filteredPatients.length === 0}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="active" className="border-none p-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Patients</CardTitle>
                    <CardDescription>Patients currently admitted or with ongoing treatment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-3">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{activePatients}</p>
                          <p className="text-sm text-muted-foreground">Active patients</p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => handleFilterChange("active")}>
                        View All Active
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6">
                    <Button variant="outline" className="w-full" onClick={() => router.push("/appointments")}>
                      <Calendar className="mr-2 h-4 w-4" /> View Appointments
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="recent" className="border-none p-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Patients</CardTitle>
                    <CardDescription>Patients registered or visited in the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-3">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{recentPatients}</p>
                          <p className="text-sm text-muted-foreground">Recent patients</p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => handleFilterChange("recent")}>
                        View Recent
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6">
                    <Button variant="outline" className="w-full" onClick={() => router.push("/reports")}>
                      <FileText className="mr-2 h-4 w-4" /> Generate Reports
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
