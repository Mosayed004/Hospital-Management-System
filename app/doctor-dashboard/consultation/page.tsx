"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Save, FileText, Pill, Activity, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AuthGuard from "@/components/auth-guard"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  bloodType: string
  allergies: string[]
  medicalHistory: string
}

interface Consultation {
  patientId: string
  appointmentId: string
  notes: string
  diagnosis: string
  vitalSigns: {
    bloodPressure: string
    heartRate: string
    temperature: string
    respiratoryRate: string
    oxygenSaturation: string
  }
  prescriptions: {
    id: string
    medication: string
    dosage: string
    frequency: string
    duration: string
    instructions: string
  }[]
  labTests: {
    id: string
    name: string
    instructions: string
  }[]
  followUp: {
    recommended: boolean
    date: string
    reason: string
  }
}

export default function ConsultationPage() {
  return (
    <AuthGuard allowedRoles={["doctor", "admin"]}>
      <ConsultationContent />
    </AuthGuard>
  )
}

function ConsultationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [consultation, setConsultation] = useState<Consultation>({
    patientId: "",
    appointmentId: "",
    notes: "",
    diagnosis: "",
    vitalSigns: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      respiratoryRate: "",
      oxygenSaturation: "",
    },
    prescriptions: [],
    labTests: [],
    followUp: {
      recommended: false,
      date: "",
      reason: "",
    },
  })

  useEffect(() => {
    const patientId = searchParams.get("patientId")
    const appointmentId = searchParams.get("appointmentId")

    if (!patientId) {
      toast({
        title: "Error",
        description: "Patient ID is required to start a consultation",
        variant: "destructive",
      })
      router.push("/doctor-dashboard")
      return
    }

    // In a real application, fetch patient data from API
    // For now, we'll use mock data
    const fetchPatient = () => {
      setLoading(true)
      try {
        // Mock patient data
        const mockPatients = [
          {
            id: "1",
            name: "John Doe",
            age: 45,
            gender: "Male",
            bloodType: "O+",
            allergies: ["Penicillin", "Sulfa drugs"],
            medicalHistory:
              "Patient has a history of hypertension and type 2 diabetes. Family history of heart disease.",
          },
          {
            id: "2",
            name: "Jane Smith",
            age: 32,
            gender: "Female",
            bloodType: "A-",
            allergies: ["Penicillin"],
            medicalHistory: "Patient is currently in first trimester of pregnancy. No chronic conditions.",
          },
        ]

        setTimeout(() => {
          const foundPatient = mockPatients.find((p) => p.id === patientId)
          setPatient(foundPatient || null)

          if (foundPatient) {
            setConsultation({
              ...consultation,
              patientId: foundPatient.id,
              appointmentId: appointmentId || "unknown",
            })
          }

          setLoading(false)
        }, 500) // Simulate network delay
      } catch (error) {
        console.error("Error fetching patient:", error)
        toast({
          title: "Error",
          description: "Failed to load patient data. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchPatient()
  }, [searchParams, toast, router, consultation])

  const handleAddPrescription = () => {
    const newPrescription = {
      id: `rx-${Date.now()}`,
      medication: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    }
    setConsultation({
      ...consultation,
      prescriptions: [...consultation.prescriptions, newPrescription],
    })
  }

  const handleRemovePrescription = (id: string) => {
    setConsultation({
      ...consultation,
      prescriptions: consultation.prescriptions.filter((p) => p.id !== id),
    })
  }

  const handleUpdatePrescription = (id: string, field: string, value: string) => {
    setConsultation({
      ...consultation,
      prescriptions: consultation.prescriptions.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    })
  }

  const handleAddLabTest = () => {
    const newLabTest = {
      id: `lab-${Date.now()}`,
      name: "",
      instructions: "",
    }
    setConsultation({
      ...consultation,
      labTests: [...consultation.labTests, newLabTest],
    })
  }

  const handleRemoveLabTest = (id: string) => {
    setConsultation({
      ...consultation,
      labTests: consultation.labTests.filter((l) => l.id !== id),
    })
  }

  const handleUpdateLabTest = (id: string, field: string, value: string) => {
    setConsultation({
      ...consultation,
      labTests: consultation.labTests.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    })
  }

  const handleUpdateVitalSigns = (field: string, value: string) => {
    setConsultation({
      ...consultation,
      vitalSigns: {
        ...consultation.vitalSigns,
        [field]: value,
      },
    })
  }

  const handleUpdateFollowUp = (field: string, value: any) => {
    setConsultation({
      ...consultation,
      followUp: {
        ...consultation.followUp,
        [field]: value,
      },
    })
  }

  const handleSaveConsultation = () => {
    // In a real application, this would save to the database
    console.log("Saving consultation:", consultation)

    toast({
      title: "Consultation Saved",
      description: "The consultation has been saved successfully.",
    })

    // Navigate back to the doctor dashboard
    router.push("/doctor-dashboard")
  }

  const handleBackToDashboard = () => {
    router.push("/doctor-dashboard")
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={handleBackToDashboard}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Loading patient information...</CardTitle>
            <CardDescription>Please wait while we fetch the patient details.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-gray-200 h-24 w-24 mb-4"></div>
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

  if (!patient) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={handleBackToDashboard}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Patient Not Found</CardTitle>
            <CardDescription>The requested patient could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please return to the dashboard and select a valid patient.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleBackToDashboard}>Return to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={handleBackToDashboard}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <Button onClick={handleSaveConsultation}>
          <Save className="mr-2 h-4 w-4" /> Save Consultation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
              {patient.age} years • {patient.gender} • {patient.bloodType}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Allergies</h3>
                <Separator className="my-2" />
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

              <div>
                <h3 className="text-sm font-medium text-gray-500">Medical History</h3>
                <Separator className="my-2" />
                <p className="text-sm">{patient.medicalHistory}</p>
              </div>

              <div>
                <Button variant="outline" className="w-full" onClick={() => router.push(`/records/${patient.id}`)}>
                  <FileText className="mr-2 h-4 w-4" /> View Complete Medical Records
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Consultation</CardTitle>
            <CardDescription>Record consultation details for {patient.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="notes">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                <TabsTrigger value="lab">Lab Tests</TabsTrigger>
                <TabsTrigger value="followup">Follow-up</TabsTrigger>
              </TabsList>

              <TabsContent value="notes" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="consultation-notes">Consultation Notes</Label>
                    <Textarea
                      id="consultation-notes"
                      placeholder="Enter detailed notes about the patient's condition, symptoms, and observations..."
                      className="min-h-[200px] mt-2"
                      value={consultation.notes}
                      onChange={(e) => setConsultation({ ...consultation, notes: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="diagnosis">Diagnosis</Label>
                    <Textarea
                      id="diagnosis"
                      placeholder="Enter diagnosis..."
                      className="min-h-[100px] mt-2"
                      value={consultation.diagnosis}
                      onChange={(e) => setConsultation({ ...consultation, diagnosis: e.target.value })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vitals" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="blood-pressure">Blood Pressure (mmHg)</Label>
                    <Input
                      id="blood-pressure"
                      placeholder="e.g., 120/80"
                      value={consultation.vitalSigns.bloodPressure}
                      onChange={(e) => handleUpdateVitalSigns("bloodPressure", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heart-rate">Heart Rate (bpm)</Label>
                    <Input
                      id="heart-rate"
                      placeholder="e.g., 72"
                      value={consultation.vitalSigns.heartRate}
                      onChange={(e) => handleUpdateVitalSigns("heartRate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°F/°C)</Label>
                    <Input
                      id="temperature"
                      placeholder="e.g., 98.6°F"
                      value={consultation.vitalSigns.temperature}
                      onChange={(e) => handleUpdateVitalSigns("temperature", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="respiratory-rate">Respiratory Rate (breaths/min)</Label>
                    <Input
                      id="respiratory-rate"
                      placeholder="e.g., 16"
                      value={consultation.vitalSigns.respiratoryRate}
                      onChange={(e) => handleUpdateVitalSigns("respiratoryRate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oxygen-saturation">Oxygen Saturation (%)</Label>
                    <Input
                      id="oxygen-saturation"
                      placeholder="e.g., 98"
                      value={consultation.vitalSigns.oxygenSaturation}
                      onChange={(e) => handleUpdateVitalSigns("oxygenSaturation", e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="prescriptions" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Prescriptions</h3>
                  <Button size="sm" onClick={handleAddPrescription}>
                    <Pill className="mr-2 h-4 w-4" /> Add Prescription
                  </Button>
                </div>

                {consultation.prescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {consultation.prescriptions.map((prescription, index) => (
                      <Card key={prescription.id}>
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">Prescription #{index + 1}</CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemovePrescription(prescription.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`medication-${prescription.id}`}>Medication</Label>
                              <Input
                                id={`medication-${prescription.id}`}
                                placeholder="Medication name"
                                value={prescription.medication}
                                onChange={(e) =>
                                  handleUpdatePrescription(prescription.id, "medication", e.target.value)
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`dosage-${prescription.id}`}>Dosage</Label>
                              <Input
                                id={`dosage-${prescription.id}`}
                                placeholder="e.g., 10mg"
                                value={prescription.dosage}
                                onChange={(e) => handleUpdatePrescription(prescription.id, "dosage", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`frequency-${prescription.id}`}>Frequency</Label>
                              <Input
                                id={`frequency-${prescription.id}`}
                                placeholder="e.g., Once daily"
                                value={prescription.frequency}
                                onChange={(e) => handleUpdatePrescription(prescription.id, "frequency", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`duration-${prescription.id}`}>Duration</Label>
                              <Input
                                id={`duration-${prescription.id}`}
                                placeholder="e.g., 7 days"
                                value={prescription.duration}
                                onChange={(e) => handleUpdatePrescription(prescription.id, "duration", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor={`instructions-${prescription.id}`}>Instructions</Label>
                              <Textarea
                                id={`instructions-${prescription.id}`}
                                placeholder="Special instructions for the patient"
                                value={prescription.instructions}
                                onChange={(e) =>
                                  handleUpdatePrescription(prescription.id, "instructions", e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg">
                    <Pill className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-medium mb-1">No Prescriptions</h3>
                    <p className="text-sm text-muted-foreground">Click the button above to add a prescription.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="lab" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Laboratory Tests</h3>
                  <Button size="sm" onClick={handleAddLabTest}>
                    <Activity className="mr-2 h-4 w-4" /> Order Lab Test
                  </Button>
                </div>

                {consultation.labTests.length > 0 ? (
                  <div className="space-y-4">
                    {consultation.labTests.map((labTest, index) => (
                      <Card key={labTest.id}>
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">Lab Test #{index + 1}</CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveLabTest(labTest.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`test-name-${labTest.id}`}>Test Name</Label>
                            <Input
                              id={`test-name-${labTest.id}`}
                              placeholder="e.g., Complete Blood Count"
                              value={labTest.name}
                              onChange={(e) => handleUpdateLabTest(labTest.id, "name", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`test-instructions-${labTest.id}`}>Instructions</Label>
                            <Textarea
                              id={`test-instructions-${labTest.id}`}
                              placeholder="Special instructions for the lab"
                              value={labTest.instructions}
                              onChange={(e) => handleUpdateLabTest(labTest.id, "instructions", e.target.value)}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg">
                    <Activity className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-medium mb-1">No Lab Tests</h3>
                    <p className="text-sm text-muted-foreground">Click the button above to order a lab test.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="followup" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="recommend-followup"
                      checked={consultation.followUp.recommended}
                      onChange={(e) => handleUpdateFollowUp("recommended", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="recommend-followup">Recommend Follow-up Appointment</Label>
                  </div>

                  {consultation.followUp.recommended && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="followup-date">Recommended Date</Label>
                        <Input
                          id="followup-date"
                          type="date"
                          value={consultation.followUp.date}
                          onChange={(e) => handleUpdateFollowUp("date", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="followup-reason">Reason for Follow-up</Label>
                        <Textarea
                          id="followup-reason"
                          placeholder="Reason for recommending a follow-up appointment"
                          value={consultation.followUp.reason}
                          onChange={(e) => handleUpdateFollowUp("reason", e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-between">
            <Button variant="outline" onClick={handleBackToDashboard}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSaveConsultation}>
              <CheckCircle className="mr-2 h-4 w-4" /> Complete Consultation
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
