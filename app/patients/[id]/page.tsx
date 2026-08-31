"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Clock, FileText, Phone, Mail, Home, Pill } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import PrescriptionHistory from "@/components/prescription-history"
import AuthGuard from "@/components/auth-guard"

interface Patient {
  id: string
  name: string
  dateOfBirth: string
  gender: string
  contactNumber: string
  email: string
  address: string
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  bloodType: string
  allergies: string[]
  medicalHistory: string
  insuranceProvider: string
  insuranceNumber: string
  registrationDate: string
  lastVisit: string
}

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const { id } = params

  useEffect(() => {
    const fetchPatient = () => {
      setLoading(true)
      try {
        // Get patients from localStorage
        const storedPatients = localStorage.getItem("patients")
        if (storedPatients) {
          const patients = JSON.parse(storedPatients)
          const foundPatient = patients.find((p: any) => p.id === id)
          setPatient(foundPatient || null)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching patient:", error)
        toast({
          title: "Error",
          description: "Failed to load patient data",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchPatient()
  }, [id, toast])

  const handleBackToPatients = () => {
    router.push("/patients")
  }

  const handleEditPatient = () => {
    toast({
      title: "Edit Patient",
      description: "Opening patient edit form",
    })
    // In a real app, this would navigate to an edit form or open a modal
  }

  const handleScheduleAppointment = () => {
    router.push(`/appointments/new?patientId=${id}`)
  }

  const handlePrescribeMedication = () => {
    router.push(`/doctor-dashboard/prescribe?patientId=${id}`)
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={handleBackToPatients}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
        </div>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={handleBackToPatients}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Patient Not Found</CardTitle>
            <CardDescription>The requested patient could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please return to the patient list and select a valid patient.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleBackToPatients}>Return to Patients</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <AuthGuard allowedRoles={["doctor", "nurse", "admin", "receptionist"]}>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={handleBackToPatients}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Patients
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleEditPatient}>
              Edit Patient
            </Button>
            <Button variant="outline" onClick={handleScheduleAppointment}>
              Schedule Appointment
            </Button>
            <Button onClick={handlePrescribeMedication}>
              <Pill className="mr-2 h-4 w-4" /> Prescribe Medication
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={`/placeholder.svg?height=96&width=96`} alt={patient.name} />
                  <AvatarFallback>
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-center text-2xl">{patient.name}</CardTitle>
              <CardDescription className="text-center">
                {calculateAge(patient.dateOfBirth)} years • {patient.gender} • {patient.bloodType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                  <Separator className="my-2" />
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm">{patient.contactNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm">{patient.email}</span>
                    </div>
                    <div className="flex items-start">
                      <Home className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                      <span className="text-sm">{patient.address}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Emergency Contact</h3>
                  <Separator className="my-2" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{patient.emergencyContact.name}</div>
                    <div className="text-sm">{patient.emergencyContact.relationship}</div>
                    <div className="text-sm">{patient.emergencyContact.phone}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Insurance</h3>
                  <Separator className="my-2" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{patient.insuranceProvider}</div>
                    <div className="text-sm">Policy: {patient.insuranceNumber}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Patient Since</h3>
                  <Separator className="my-2" />
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">{new Date(patient.registrationDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Patient Records</CardTitle>
              <CardDescription>View and manage patient medical information</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="medications">Medications</TabsTrigger>
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Allergies</h3>
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies.length > 0 ? (
                        patient.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive">
                            {allergy}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm">No known allergies</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2">Medical History</h3>
                    <p className="text-sm">{patient.medicalHistory}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2">Recent Vitals</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Blood Pressure</div>
                          <div className="text-xl font-bold">120/80</div>
                          <div className="text-xs text-muted-foreground">Last checked: 2 days ago</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Heart Rate</div>
                          <div className="text-xl font-bold">72 bpm</div>
                          <div className="text-xs text-muted-foreground">Last checked: 2 days ago</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Temperature</div>
                          <div className="text-xl font-bold">98.6°F</div>
                          <div className="text-xs text-muted-foreground">Last checked: 2 days ago</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Weight</div>
                          <div className="text-xl font-bold">165 lbs</div>
                          <div className="text-xs text-muted-foreground">Last checked: 2 days ago</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => router.push(`/records/${patient.id}`)}>
                      <FileText className="mr-2 h-4 w-4" /> View Complete Medical Records
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="medications">
                  <PrescriptionHistory patientId={patient.id} />
                </TabsContent>

                <TabsContent value="appointments">
                  <Card>
                    <CardHeader>
                      <CardTitle>Appointment History</CardTitle>
                      <CardDescription>View past and upcoming appointments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Upcoming Appointments</h4>
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium">General Checkup</div>
                                  <div className="text-sm text-muted-foreground">Dr. Sarah Johnson</div>
                                  <div className="text-sm mt-1">
                                    <Calendar className="h-4 w-4 inline mr-1" />
                                    May 15, 2023 at 10:30 AM
                                  </div>
                                </div>
                                <Badge>Confirmed</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Past Appointments</h4>
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium">Follow-up Consultation</div>
                                  <div className="text-sm text-muted-foreground">Dr. Michael Chen</div>
                                  <div className="text-sm mt-1">
                                    <Calendar className="h-4 w-4 inline mr-1" />
                                    April 2, 2023 at 2:00 PM
                                  </div>
                                </div>
                                <Badge variant="outline">Completed</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="flex justify-end">
                          <Button onClick={handleScheduleAppointment}>Schedule New Appointment</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents">
                  <Card>
                    <CardHeader>
                      <CardTitle>Patient Documents</CardTitle>
                      <CardDescription>View and manage patient documents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">Lab Results</div>
                                  <div className="text-sm text-muted-foreground">Complete Blood Count</div>
                                  <div className="text-xs mt-1">Uploaded: April 5, 2023</div>
                                </div>
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">Imaging</div>
                                  <div className="text-sm text-muted-foreground">Chest X-Ray</div>
                                  <div className="text-xs mt-1">Uploaded: March 22, 2023</div>
                                </div>
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">Consent Form</div>
                                  <div className="text-sm text-muted-foreground">Procedure Consent</div>
                                  <div className="text-xs mt-1">Uploaded: February 15, 2023</div>
                                </div>
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="flex justify-end">
                          <Button variant="outline">Upload New Document</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
