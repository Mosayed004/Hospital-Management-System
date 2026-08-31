"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Pill, User, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

export default function MedicationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [medication, setMedication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { id } = params

  useEffect(() => {
    // In a real application, fetch medication data from API
    // For now, we'll use mock data
    const fetchMedication = () => {
      const mockMedications = [
        {
          id: "MED-0112",
          name: "Amoxicillin 500mg",
          genericName: "Amoxicillin",
          category: "Antibiotics",
          dosage: "500mg",
          form: "Capsule",
          frequency: "Three times daily",
          route: "Oral",
          startDate: "2023-04-15",
          endDate: "2023-07-15",
          status: "Active",
          instructions: "Take with food. Complete the full course even if feeling better.",
          quantity: 124,
          refillsRemaining: 2,
          lastRefillDate: "2023-04-15",
          nextRefillDate: "2023-05-15",
          prescribedBy: "Dr. Sarah Smith",
          prescriptionDate: "2023-04-10",
          pharmacy: "Helwan University Hospital Pharmacy",
          patient: {
            id: "1",
            name: "John Doe",
            age: 45,
            gender: "Male",
          },
          interactions: [
            { medication: "Warfarin", severity: "High", description: "May increase anticoagulant effect" },
            { medication: "Probenecid", severity: "Medium", description: "May increase amoxicillin levels" },
          ],
          sideEffects: ["Diarrhea", "Nausea", "Rash", "Vomiting"],
        },
        {
          id: "MED-0113",
          name: "Lisinopril 10mg",
          genericName: "Lisinopril",
          category: "Antihypertensive",
          dosage: "10mg",
          form: "Tablet",
          frequency: "Once daily",
          route: "Oral",
          startDate: "2023-03-20",
          endDate: "Ongoing",
          status: "Active",
          instructions: "Take in the morning with or without food. Avoid potassium supplements.",
          quantity: 45,
          refillsRemaining: 3,
          lastRefillDate: "2023-03-20",
          nextRefillDate: "2023-05-20",
          prescribedBy: "Dr. Michael Johnson",
          prescriptionDate: "2023-03-15",
          pharmacy: "Helwan University Hospital Pharmacy",
          patient: {
            id: "2",
            name: "Jane Smith",
            age: 58,
            gender: "Female",
          },
          interactions: [
            { medication: "Potassium supplements", severity: "High", description: "May cause hyperkalemia" },
            { medication: "NSAIDs", severity: "Medium", description: "May reduce effectiveness" },
          ],
          sideEffects: ["Dry cough", "Dizziness", "Headache", "Fatigue"],
        },
        {
          id: "MED-0114",
          name: "Prednisone 20mg",
          genericName: "Prednisone",
          category: "Corticosteroids",
          dosage: "20mg",
          form: "Tablet",
          frequency: "Once daily",
          route: "Oral",
          startDate: "2023-04-05",
          endDate: "2023-05-05",
          status: "Active",
          instructions: "Take with food in the morning. Do not stop abruptly.",
          quantity: 78,
          refillsRemaining: 0,
          lastRefillDate: "2023-04-05",
          nextRefillDate: "N/A",
          prescribedBy: "Dr. Emily Chen",
          prescriptionDate: "2023-04-01",
          pharmacy: "Helwan University Hospital Pharmacy",
          patient: {
            id: "3",
            name: "Robert Johnson",
            age: 62,
            gender: "Male",
          },
          interactions: [
            { medication: "Live vaccines", severity: "High", description: "May increase risk of infection" },
            { medication: "NSAIDs", severity: "Low", description: "May increase risk of GI bleeding" },
          ],
          sideEffects: ["Increased appetite", "Weight gain", "Mood changes", "Insomnia"],
        },
        {
          id: "MED-0115",
          name: "Insulin Glargine",
          genericName: "Insulin Glargine",
          category: "Diabetes",
          dosage: "10 units",
          form: "Solution",
          frequency: "Once daily",
          route: "Subcutaneous",
          startDate: "2023-02-10",
          endDate: "Ongoing",
          status: "Active",
          instructions: "Inject subcutaneously at the same time each day. Rotate injection sites.",
          quantity: 12,
          refillsRemaining: 1,
          lastRefillDate: "2023-04-10",
          nextRefillDate: "2023-05-10",
          prescribedBy: "Dr. James Wilson",
          prescriptionDate: "2023-02-05",
          pharmacy: "Helwan University Hospital Pharmacy",
          patient: {
            id: "4",
            name: "Maria Garcia",
            age: 54,
            gender: "Female",
          },
          interactions: [
            { medication: "Beta-blockers", severity: "Medium", description: "May mask hypoglycemia symptoms" },
            { medication: "Alcohol", severity: "High", description: "May cause hypoglycemia" },
          ],
          sideEffects: ["Hypoglycemia", "Injection site reactions", "Weight gain", "Edema"],
        },
      ]

      setTimeout(() => {
        const foundMedication = mockMedications.find((m) => m.id === id)
        setMedication(foundMedication || null)
        setLoading(false)
      }, 1000) // Simulate network delay
    }
    fetchMedication()
  }, [id, toast])

  const handleEdit = () => {
    toast({
      title: "Edit Medication",
      description: "Medication edit functionality would open here",
    })
  }

  const handleRefill = () => {
    toast({
      title: "Process Refill",
      description: "Medication refill has been processed successfully",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!medication) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold mb-2">Medication Not Found</h2>
              <p className="text-muted-foreground">
                The medication you are looking for does not exist or has been removed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate days left in current supply
  const today = new Date()
  const nextRefill = medication.nextRefillDate === "N/A" ? today : new Date(medication.nextRefillDate)
  const daysLeft =
    medication.nextRefillDate === "N/A"
      ? 0
      : Math.max(0, Math.ceil((nextRefill.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
  const supplyPercentage = Math.min(100, Math.max(0, (daysLeft / 30) * 100))

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pharmacy
        </Button>
        <Button onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" /> Edit Medication
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="flex items-center">
                <Pill className="mr-2 h-5 w-5" /> Medication Details
              </CardTitle>
              <Badge variant={medication.status === "Active" ? "default" : "secondary"}>{medication.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">{medication.name}</h3>
                <p className="text-sm text-muted-foreground">{medication.genericName}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{medication.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dosage:</span>
                  <span>{medication.dosage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Form:</span>
                  <span>{medication.form}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Route:</span>
                  <span>{medication.route}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frequency:</span>
                  <span>{medication.frequency}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Prescription Information</h4>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prescribed By:</span>
                  <span>{medication.prescribedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prescription Date:</span>
                  <span>{medication.prescriptionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date:</span>
                  <span>{medication.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date:</span>
                  <span>{medication.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pharmacy:</span>
                  <span>{medication.pharmacy}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Patient Information</h4>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{medication.patient.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span>{medication.patient.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span>{medication.patient.gender}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => router.push(`/patients/${medication.patient.id}`)}
                >
                  View Patient Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Medication Management</CardTitle>
            <CardDescription>View and manage prescription details and refills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Current Supply</h3>
                  <span className="text-sm">{daysLeft} days remaining</span>
                </div>
                <Progress value={supplyPercentage} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Last Refill: {medication.lastRefillDate}</span>
                  <span>Next Refill: {medication.nextRefillDate}</span>
                </div>
                <div className="flex justify-between mt-4">
                  <div>
                    <span className="text-sm font-medium">Quantity: </span>
                    <span className="text-sm">
                      {medication.quantity} {medication.form.toLowerCase()}s
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Refills Remaining: </span>
                    <span className="text-sm">{medication.refillsRemaining}</span>
                  </div>
                </div>
                {daysLeft < 7 && (
                  <div className="flex items-center mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="text-sm text-yellow-700">Refill needed soon</span>
                  </div>
                )}
                {medication.refillsRemaining > 0 && (
                  <Button className="w-full mt-2" onClick={handleRefill}>
                    Process Refill
                  </Button>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">Instructions</h3>
                <div className="p-4 bg-muted rounded-md">
                  <p>{medication.instructions}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Potential Interactions</h3>
                {medication.interactions.length > 0 ? (
                  <div className="space-y-2">
                    {medication.interactions.map((interaction: any, index: number) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{interaction.medication}</span>
                          <Badge
                            variant={
                              interaction.severity === "High"
                                ? "destructive"
                                : interaction.severity === "Medium"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {interaction.severity} Risk
                          </Badge>
                        </div>
                        <p className="text-sm">{interaction.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No known interactions.</p>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Potential Side Effects</h3>
                {medication.sideEffects.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {medication.sideEffects.map((effect: string, index: number) => (
                      <div key={index} className="flex items-center p-2 border rounded-md">
                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                        <span className="text-sm">{effect}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No known side effects.</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <div className="flex space-x-2 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push(`/records/${medication.patient.id}`)}
              >
                View Medical Records
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  toast({
                    title: "Print Prescription",
                    description: "Prescription has been sent to the printer",
                  })
                }}
              >
                Print Prescription
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
