"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Save,
  Pill,
  CheckCircle,
  Plus,
  Trash2,
  AlertTriangle,
  Search,
  Info,
  RefreshCw,
  Calendar,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form } from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import AuthGuard from "@/components/auth-guard"

// Define types
interface Patient {
  id: string
  name: string
  age: number
  gender: string
  bloodType: string
  allergies: string[]
  medicalHistory?: string
  currentMedications?: {
    name: string
    dosage: string
    frequency: string
  }[]
}

interface Medication {
  id: string
  name: string
  genericName: string
  category: string
  form: string
  strength: string
  route: string
  dosage: string
  frequency: string
  duration: string
  quantity: string
  refills: string
  instructions: string
  sideEffects: string[]
  interactions: string[]
  contraindications: string[]
}

// Define validation schema for a medication
const medicationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Medication name is required"),
  genericName: z.string().optional(),
  category: z.string().optional(),
  form: z.string().min(1, "Medication form is required"),
  strength: z.string().min(1, "Medication strength is required"),
  route: z.string().min(1, "Administration route is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
  quantity: z.string().min(1, "Quantity is required"),
  refills: z.string(),
  instructions: z.string(),
  sideEffects: z.array(z.string()).optional(),
  interactions: z.array(z.string()).optional(),
  contraindications: z.array(z.string()).optional(),
})

// Define validation schema for the prescription
const prescriptionSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  patientName: z.string(),
  doctorId: z.string(),
  doctorName: z.string(),
  date: z.string(),
  medications: z.array(medicationSchema).min(1, "At least one medication is required"),
  notes: z.string().optional(),
  status: z.string(),
  urgent: z.boolean().default(false),
  followUp: z.boolean().default(false),
  followUpDate: z.string().optional(),
  followUpNotes: z.string().optional(),
})

// Mock medication database
const MEDICATION_DATABASE = [
  {
    id: "med-001",
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    category: "Antibiotics",
    forms: ["Capsule", "Tablet", "Suspension"],
    strengths: ["250mg", "500mg", "875mg"],
    routes: ["Oral"],
    sideEffects: ["Diarrhea", "Nausea", "Rash"],
    interactions: ["Allopurinol", "Probenecid", "Warfarin"],
    contraindications: ["Penicillin allergy", "Mononucleosis"],
  },
  {
    id: "med-002",
    name: "Lisinopril",
    genericName: "Lisinopril",
    category: "Antihypertensive",
    forms: ["Tablet"],
    strengths: ["5mg", "10mg", "20mg", "40mg"],
    routes: ["Oral"],
    sideEffects: ["Dry cough", "Dizziness", "Headache"],
    interactions: ["Potassium supplements", "NSAIDs", "Lithium"],
    contraindications: ["Pregnancy", "History of angioedema"],
  },
  {
    id: "med-003",
    name: "Atorvastatin",
    genericName: "Atorvastatin",
    category: "Statin",
    forms: ["Tablet"],
    strengths: ["10mg", "20mg", "40mg", "80mg"],
    routes: ["Oral"],
    sideEffects: ["Muscle pain", "Liver problems", "Digestive issues"],
    interactions: ["Erythromycin", "Clarithromycin", "Grapefruit juice"],
    contraindications: ["Liver disease", "Pregnancy"],
  },
  {
    id: "med-004",
    name: "Metformin",
    genericName: "Metformin",
    category: "Antidiabetic",
    forms: ["Tablet", "Extended-release tablet"],
    strengths: ["500mg", "850mg", "1000mg"],
    routes: ["Oral"],
    sideEffects: ["Nausea", "Diarrhea", "Abdominal discomfort"],
    interactions: ["Cimetidine", "Furosemide", "Nifedipine"],
    contraindications: ["Kidney disease", "Liver disease", "Heart failure"],
  },
  {
    id: "med-005",
    name: "Albuterol",
    genericName: "Albuterol",
    category: "Bronchodilator",
    forms: ["Inhaler", "Nebulizer solution"],
    strengths: ["90mcg/actuation", "2.5mg/3mL"],
    routes: ["Inhalation"],
    sideEffects: ["Tremor", "Nervousness", "Increased heart rate"],
    interactions: ["Beta-blockers", "Diuretics", "MAO inhibitors"],
    contraindications: ["Hypersensitivity to albuterol"],
  },
  {
    id: "med-006",
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    category: "NSAID",
    forms: ["Tablet", "Capsule", "Suspension"],
    strengths: ["200mg", "400mg", "600mg", "800mg"],
    routes: ["Oral"],
    sideEffects: ["Stomach pain", "Heartburn", "Dizziness"],
    interactions: ["Aspirin", "Blood thinners", "ACE inhibitors"],
    contraindications: ["Aspirin allergy", "Heart failure", "Stomach ulcers"],
  },
  {
    id: "med-007",
    name: "Levothyroxine",
    genericName: "Levothyroxine",
    category: "Thyroid hormone",
    forms: ["Tablet"],
    strengths: [
      "25mcg",
      "50mcg",
      "75mcg",
      "88mcg",
      "100mcg",
      "112mcg",
      "125mcg",
      "137mcg",
      "150mcg",
      "175mcg",
      "200mcg",
    ],
    routes: ["Oral"],
    sideEffects: ["Weight loss", "Tremors", "Insomnia"],
    interactions: ["Calcium supplements", "Iron supplements", "Antacids"],
    contraindications: ["Thyrotoxicosis", "Adrenal insufficiency"],
  },
  {
    id: "med-008",
    name: "Sertraline",
    genericName: "Sertraline",
    category: "SSRI",
    forms: ["Tablet", "Oral solution"],
    strengths: ["25mg", "50mg", "100mg"],
    routes: ["Oral"],
    sideEffects: ["Nausea", "Insomnia", "Sexual dysfunction"],
    interactions: ["MAO inhibitors", "Pimozide", "Other SSRIs"],
    contraindications: ["MAO inhibitor use within 14 days"],
  },
  {
    id: "med-009",
    name: "Omeprazole",
    genericName: "Omeprazole",
    category: "Proton pump inhibitor",
    forms: ["Capsule", "Tablet"],
    strengths: ["10mg", "20mg", "40mg"],
    routes: ["Oral"],
    sideEffects: ["Headache", "Abdominal pain", "Diarrhea"],
    interactions: ["Clopidogrel", "Diazepam", "Phenytoin"],
    contraindications: ["Hypersensitivity to omeprazole"],
  },
  {
    id: "med-010",
    name: "Hydrochlorothiazide",
    genericName: "Hydrochlorothiazide",
    category: "Diuretic",
    forms: ["Tablet"],
    strengths: ["12.5mg", "25mg", "50mg"],
    routes: ["Oral"],
    sideEffects: ["Increased urination", "Dizziness", "Electrolyte imbalance"],
    interactions: ["Lithium", "Digoxin", "NSAIDs"],
    contraindications: ["Sulfa allergy", "Anuria"],
  },
]

export default function PrescribePage() {
  return (
    <AuthGuard allowedRoles={["doctor", "admin"]}>
      <PrescribeContent />
    </AuthGuard>
  )
}

function PrescribeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMedication, setSelectedMedication] = useState<any>(null)
  const [medicationSearchQuery, setMedicationSearchQuery] = useState("")
  const [filteredMedications, setFilteredMedications] = useState(MEDICATION_DATABASE)
  const [showMedicationSearch, setShowMedicationSearch] = useState(false)
  const [interactionWarnings, setInteractionWarnings] = useState<string[]>([])
  const [allergyWarnings, setAllergyWarnings] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // Initialize form with default values
  const form = useForm<z.infer<typeof prescriptionSchema>>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      id: `rx-${Date.now()}`,
      patientId: "",
      patientName: "",
      doctorId: "doc-001", // In a real app, this would be the logged-in doctor's ID
      doctorName: "Dr. John Smith", // In a real app, this would be the logged-in doctor's name
      date: new Date().toISOString().split("T")[0],
      medications: [],
      notes: "",
      status: "Active",
      urgent: false,
      followUp: false,
      followUpDate: "",
      followUpNotes: "",
    },
  })

  useEffect(() => {
    const patientId = searchParams.get("patientId")

    if (!patientId) {
      toast({
        title: "Error",
        description: "Patient ID is required to prescribe medication",
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
            medicalHistory: "Hypertension, Type 2 Diabetes",
            currentMedications: [
              { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
              { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
            ],
          },
          {
            id: "2",
            name: "Jane Smith",
            age: 32,
            gender: "Female",
            bloodType: "A-",
            allergies: ["Penicillin"],
            medicalHistory: "Asthma, Seasonal allergies",
            currentMedications: [
              { name: "Albuterol", dosage: "90mcg", frequency: "As needed" },
              { name: "Loratadine", dosage: "10mg", frequency: "Once daily" },
            ],
          },
        ]

        setTimeout(() => {
          const foundPatient = mockPatients.find((p) => p.id === patientId)
          setPatient(foundPatient || null)

          if (foundPatient) {
            form.setValue("patientId", foundPatient.id)
            form.setValue("patientName", foundPatient.name)
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
  }, [searchParams, toast, router, form])

  // Filter medications based on search query
  useEffect(() => {
    if (medicationSearchQuery.trim() === "") {
      setFilteredMedications(MEDICATION_DATABASE)
    } else {
      const query = medicationSearchQuery.toLowerCase()
      const filtered = MEDICATION_DATABASE.filter(
        (med) =>
          med.name.toLowerCase().includes(query) ||
          med.genericName.toLowerCase().includes(query) ||
          med.category.toLowerCase().includes(query),
      )
      setFilteredMedications(filtered)
    }
  }, [medicationSearchQuery])

  // Check for potential interactions and allergies
  useEffect(() => {
    const medications = form.getValues("medications")
    if (!patient || medications.length === 0) return

    // Check for allergies
    const newAllergyWarnings: string[] = []
    medications.forEach((med) => {
      const medicationInfo = MEDICATION_DATABASE.find((m) => m.name === med.name)
      if (medicationInfo) {
        // Check if patient is allergic to this medication or its category
        patient.allergies.forEach((allergy) => {
          if (
            medicationInfo.name.toLowerCase().includes(allergy.toLowerCase()) ||
            medicationInfo.category.toLowerCase().includes(allergy.toLowerCase()) ||
            medicationInfo.contraindications.some((c) => c.toLowerCase().includes(allergy.toLowerCase()))
          ) {
            newAllergyWarnings.push(`Patient has an allergy to ${allergy} which may be related to ${med.name}`)
          }
        })
      }
    })
    setAllergyWarnings(newAllergyWarnings)

    // Check for interactions between prescribed medications
    const newInteractionWarnings: string[] = []
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const med1 = MEDICATION_DATABASE.find((m) => m.name === medications[i].name)
        const med2 = MEDICATION_DATABASE.find((m) => m.name === medications[j].name)

        if (med1 && med2) {
          if (med1.interactions.includes(med2.name) || med2.interactions.includes(med1.name)) {
            newInteractionWarnings.push(`Potential interaction between ${med1.name} and ${med2.name}`)
          }
        }
      }
    }

    // Check for interactions with current medications
    if (patient.currentMedications) {
      medications.forEach((newMed) => {
        const medicationInfo = MEDICATION_DATABASE.find((m) => m.name === newMed.name)
        if (medicationInfo) {
          patient.currentMedications?.forEach((currentMed) => {
            if (medicationInfo.interactions.some((i) => i.toLowerCase().includes(currentMed.name.toLowerCase()))) {
              newInteractionWarnings.push(
                `Potential interaction between ${newMed.name} and current medication ${currentMed.name}`,
              )
            }
          })
        }
      })
    }

    setInteractionWarnings(newInteractionWarnings)
  }, [form, patient])

  const handleSelectMedication = (medication: any) => {
    setSelectedMedication(medication)
    setShowMedicationSearch(false)
  }

  const handleAddMedication = () => {
    if (!selectedMedication) return

    // Create a new medication object
    const newMedication: Medication = {
      id: `med-${Date.now()}`,
      name: selectedMedication.name,
      genericName: selectedMedication.genericName,
      category: selectedMedication.category,
      form: selectedMedication.forms[0],
      strength: selectedMedication.strengths[0],
      route: selectedMedication.routes[0],
      dosage: "",
      frequency: "",
      duration: "",
      quantity: "",
      refills: "0",
      instructions: "",
      sideEffects: selectedMedication.sideEffects,
      interactions: selectedMedication.interactions,
      contraindications: selectedMedication.contraindications,
    }

    // Add to form
    const currentMedications = form.getValues("medications")
    form.setValue("medications", [...currentMedications, newMedication])

    // Reset selected medication
    setSelectedMedication(null)
  }

  const handleRemoveMedication = (id: string) => {
    const medications = form.getValues("medications")
    if (medications.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "At least one medication is required for a prescription.",
        variant: "destructive",
      })
      return
    }

    form.setValue(
      "medications",
      medications.filter((m) => m.id !== id),
    )
  }

  const handleUpdateMedication = (id: string, field: string, value: string) => {
    const medications = form.getValues("medications")
    const updatedMedications = medications.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    form.setValue("medications", updatedMedications)
  }

  const handleSavePrescription = async () => {
    setIsSubmitting(true)

    try {
      // Validate form
      await form.trigger()
      if (!form.formState.isValid) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields for the prescription.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // If there are warnings, show confirmation dialog
      if (allergyWarnings.length > 0 || interactionWarnings.length > 0) {
        setShowConfirmDialog(true)
        setIsSubmitting(false)
        return
      }

      // If no warnings, proceed with saving
      await savePrescriptionData()
    } catch (error) {
      console.error("Error saving prescription:", error)
      toast({
        title: "Error",
        description: "Failed to save prescription. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const savePrescriptionData = async () => {
    setIsSubmitting(true)

    try {
      const prescriptionData = form.getValues()

      // Get existing prescriptions from localStorage or initialize empty array
      const existingPrescriptions = JSON.parse(localStorage.getItem("prescriptions") || "[]")

      // Add new prescription
      const updatedPrescriptions = [...existingPrescriptions, prescriptionData]

      // Save to localStorage
      localStorage.setItem("prescriptions", JSON.stringify(updatedPrescriptions))

      // Add to patient's medical record
      const storedRecords = localStorage.getItem("hms_medical_records")
      if (storedRecords) {
        const records = JSON.parse(storedRecords)
        const patientRecordIndex = records.findIndex((r: any) => r.patientId === patient?.id)

        if (patientRecordIndex !== -1) {
          // Add prescription to existing record
          if (!records[patientRecordIndex].notes) {
            records[patientRecordIndex].notes = []
          }

          records[patientRecordIndex].notes.unshift({
            id: `NOTE-${Date.now()}`,
            type: "Medication",
            content: `Prescription: ${prescriptionData.medications.map((m) => `${m.name} ${m.strength}`).join(", ")}`,
            date: new Date().toLocaleDateString(),
            author: prescriptionData.doctorName,
          })

          records[patientRecordIndex].lastUpdated = new Date().toLocaleDateString()
          localStorage.setItem("hms_medical_records", JSON.stringify(records))
        }
      }

      toast({
        title: "Prescription Saved",
        description: "The prescription has been saved successfully.",
      })

      // Navigate back to the doctor dashboard
      router.push("/doctor-dashboard")
    } catch (error) {
      console.error("Error saving prescription:", error)
      toast({
        title: "Error",
        description: "Failed to save prescription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setShowConfirmDialog(false)
    }
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
        <Button onClick={handleSavePrescription} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Prescription
            </>
          )}
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

              {patient.medicalHistory && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Medical History</h3>
                  <Separator className="my-2" />
                  <p className="text-sm">{patient.medicalHistory}</p>
                </div>
              )}

              {patient.currentMedications && patient.currentMedications.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Current Medications</h3>
                  <Separator className="my-2" />
                  <ul className="text-sm space-y-1">
                    {patient.currentMedications.map((med, index) => (
                      <li key={index}>
                        {med.name} {med.dosage}, {med.frequency}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <Button variant="outline" className="w-full" onClick={() => router.push(`/patients/${patient.id}`)}>
                  <Pill className="mr-2 h-4 w-4" /> View Medication History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Prescribe Medication</CardTitle>
            <CardDescription>Create a new prescription for {patient.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6">
                {/* Warnings Section */}
                {(allergyWarnings.length > 0 || interactionWarnings.length > 0) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-800">Prescription Warnings</h3>
                        {allergyWarnings.length > 0 && (
                          <div className="mt-2">
                            <h4 className="text-sm font-medium text-yellow-800">Allergy Warnings:</h4>
                            <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1">
                              {allergyWarnings.map((warning, index) => (
                                <li key={`allergy-${index}`}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {interactionWarnings.length > 0 && (
                          <div className="mt-2">
                            <h4 className="text-sm font-medium text-yellow-800">Interaction Warnings:</h4>
                            <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1">
                              {interactionWarnings.map((warning, index) => (
                                <li key={`interaction-${index}`}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Medication Search and Add Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Medications</h3>
                    <Button type="button" variant="outline" onClick={() => setShowMedicationSearch(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Medication
                    </Button>
                  </div>

                  {/* Medication Search Dialog */}
                  <Dialog open={showMedicationSearch} onOpenChange={setShowMedicationSearch}>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Search Medications</DialogTitle>
                        <DialogDescription>Search for medications to add to the prescription.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search medications..."
                            className="pl-8"
                            value={medicationSearchQuery}
                            onChange={(e) => setMedicationSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="border rounded-md h-[300px] overflow-y-auto">
                          {filteredMedications.length > 0 ? (
                            <div className="divide-y">
                              {filteredMedications.map((medication) => (
                                <div
                                  key={medication.id}
                                  className="p-3 hover:bg-muted cursor-pointer"
                                  onClick={() => handleSelectMedication(medication)}
                                >
                                  <div className="font-medium">{medication.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {medication.genericName} • {medication.category}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Available as: {medication.forms.join(", ")}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <p className="text-muted-foreground">No medications found</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowMedicationSearch(false)}>
                          Cancel
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Selected Medication Details */}
                  {selectedMedication && (
                    <Card className="border-dashed border-2">
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">{selectedMedication.name}</CardTitle>
                          <Button type="button" variant="default" size="sm" onClick={handleAddMedication}>
                            Add to Prescription
                          </Button>
                        </div>
                        <CardDescription>
                          {selectedMedication.genericName} • {selectedMedication.category}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Available Forms: </span>
                            {selectedMedication.forms.join(", ")}
                          </div>
                          <div>
                            <span className="font-medium">Available Strengths: </span>
                            {selectedMedication.strengths.join(", ")}
                          </div>
                          <div>
                            <span className="font-medium">Routes: </span>
                            {selectedMedication.routes.join(", ")}
                          </div>
                          <div>
                            <span className="font-medium">Side Effects: </span>
                            {selectedMedication.sideEffects.join(", ")}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Medications List */}
                  {form.getValues("medications").length > 0 ? (
                    <div className="space-y-4">
                      {form.getValues("medications").map((medication, index) => (
                        <Card key={medication.id}>
                          <CardHeader className="py-3">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base">
                                {medication.name} {medication.strength}
                              </CardTitle>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveMedication(medication.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-1" /> Remove
                              </Button>
                            </div>
                            <CardDescription>
                              {medication.genericName} • {medication.category}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="py-2 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`form-${medication.id}`}>Form *</Label>
                                <Select
                                  value={medication.form}
                                  onValueChange={(value) => handleUpdateMedication(medication.id, "form", value)}
                                >
                                  <SelectTrigger id={`form-${medication.id}`}>
                                    <SelectValue placeholder="Select form" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {MEDICATION_DATABASE.find((m) => m.name === medication.name)?.forms.map((form) => (
                                      <SelectItem key={form} value={form}>
                                        {form}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`strength-${medication.id}`}>Strength *</Label>
                                <Select
                                  value={medication.strength}
                                  onValueChange={(value) => handleUpdateMedication(medication.id, "strength", value)}
                                >
                                  <SelectTrigger id={`strength-${medication.id}`}>
                                    <SelectValue placeholder="Select strength" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {MEDICATION_DATABASE.find((m) => m.name === medication.name)?.strengths.map(
                                      (strength) => (
                                        <SelectItem key={strength} value={strength}>
                                          {strength}
                                        </SelectItem>
                                      ),
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`route-${medication.id}`}>Route *</Label>
                                <Select
                                  value={medication.route}
                                  onValueChange={(value) => handleUpdateMedication(medication.id, "route", value)}
                                >
                                  <SelectTrigger id={`route-${medication.id}`}>
                                    <SelectValue placeholder="Select route" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {MEDICATION_DATABASE.find((m) => m.name === medication.name)?.routes.map(
                                      (route) => (
                                        <SelectItem key={route} value={route}>
                                          {route}
                                        </SelectItem>
                                      ),
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`dosage-${medication.id}`}>Dosage *</Label>
                                <Input
                                  id={`dosage-${medication.id}`}
                                  placeholder="e.g., 1 tablet"
                                  value={medication.dosage}
                                  onChange={(e) => handleUpdateMedication(medication.id, "dosage", e.target.value)}
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`frequency-${medication.id}`}>Frequency *</Label>
                                <Select
                                  value={medication.frequency}
                                  onValueChange={(value) => handleUpdateMedication(medication.id, "frequency", value)}
                                >
                                  <SelectTrigger id={`frequency-${medication.id}`}>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Once daily">Once daily</SelectItem>
                                    <SelectItem value="Twice daily">Twice daily</SelectItem>
                                    <SelectItem value="Three times daily">Three times daily</SelectItem>
                                    <SelectItem value="Four times daily">Four times daily</SelectItem>
                                    <SelectItem value="Every 4 hours">Every 4 hours</SelectItem>
                                    <SelectItem value="Every 6 hours">Every 6 hours</SelectItem>
                                    <SelectItem value="Every 8 hours">Every 8 hours</SelectItem>
                                    <SelectItem value="Every 12 hours">Every 12 hours</SelectItem>
                                    <SelectItem value="As needed">As needed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`duration-${medication.id}`}>Duration *</Label>
                                <Input
                                  id={`duration-${medication.id}`}
                                  placeholder="e.g., 7 days, 1 month"
                                  value={medication.duration}
                                  onChange={(e) => handleUpdateMedication(medication.id, "duration", e.target.value)}
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`quantity-${medication.id}`}>Quantity *</Label>
                                <Input
                                  id={`quantity-${medication.id}`}
                                  placeholder="e.g., 30"
                                  value={medication.quantity}
                                  onChange={(e) => handleUpdateMedication(medication.id, "quantity", e.target.value)}
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`refills-${medication.id}`}>Refills</Label>
                                <Input
                                  id={`refills-${medication.id}`}
                                  placeholder="e.g., 3"
                                  value={medication.refills}
                                  onChange={(e) => handleUpdateMedication(medication.id, "refills", e.target.value)}
                                />
                              </div>

                              <div className="space-y-2 md:col-span-3">
                                <Label htmlFor={`instructions-${medication.id}`}>Special Instructions</Label>
                                <Textarea
                                  id={`instructions-${medication.id}`}
                                  placeholder="e.g., Take with food, Avoid alcohol"
                                  value={medication.instructions}
                                  onChange={(e) =>
                                    handleUpdateMedication(medication.id, "instructions", e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div className="text-sm">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="link" size="sm" className="h-auto p-0">
                                    <Info className="h-4 w-4 mr-1" /> View medication information
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                  <div className="space-y-2">
                                    <h4 className="font-medium">Side Effects</h4>
                                    <ul className="list-disc pl-5 text-sm">
                                      {medication.sideEffects?.map((effect, i) => (
                                        <li key={i}>{effect}</li>
                                      ))}
                                    </ul>

                                    <h4 className="font-medium">Interactions</h4>
                                    <ul className="list-disc pl-5 text-sm">
                                      {medication.interactions?.map((interaction, i) => (
                                        <li key={i}>{interaction}</li>
                                      ))}
                                    </ul>

                                    <h4 className="font-medium">Contraindications</h4>
                                    <ul className="list-disc pl-5 text-sm">
                                      {medication.contraindications?.map((contraindication, i) => (
                                        <li key={i}>{contraindication}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border rounded-lg">
                      <Pill className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <h3 className="font-medium mb-1">No Medications Added</h3>
                      <p className="text-sm text-muted-foreground">Click the button above to add a medication.</p>
                    </div>
                  )}
                </div>

                {/* Additional Prescription Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Prescription Details</h3>

                  <div className="space-y-2">
                    <Label htmlFor="prescription-notes">Additional Notes</Label>
                    <Textarea
                      id="prescription-notes"
                      placeholder="Any additional notes or instructions for the patient or pharmacist..."
                      value={form.getValues("notes")}
                      onChange={(e) => form.setValue("notes", e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="urgent"
                      checked={form.getValues("urgent")}
                      onCheckedChange={(checked) => form.setValue("urgent", checked)}
                    />
                    <Label htmlFor="urgent">Mark as Urgent</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="followUp"
                      checked={form.getValues("followUp")}
                      onCheckedChange={(checked) => form.setValue("followUp", checked)}
                    />
                    <Label htmlFor="followUp">Schedule Follow-up</Label>
                  </div>

                  {form.getValues("followUp") && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="followUpDate">Follow-up Date</Label>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Input
                            id="followUpDate"
                            type="date"
                            value={form.getValues("followUpDate")}
                            onChange={(e) => form.setValue("followUpDate", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="followUpNotes">Follow-up Notes</Label>
                        <Textarea
                          id="followUpNotes"
                          placeholder="Reason for follow-up..."
                          value={form.getValues("followUpNotes")}
                          onChange={(e) => form.setValue("followUpNotes", e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-between">
            <Button variant="outline" onClick={handleBackToDashboard}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSavePrescription} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" /> Complete Prescription
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Confirmation Dialog for Warnings */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-yellow-800">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              Confirm Prescription with Warnings
            </DialogTitle>
            <DialogDescription>
              This prescription has potential warnings. Please review before proceeding.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {allergyWarnings.length > 0 && (
              <div>
                <h4 className="font-medium text-yellow-800">Allergy Warnings:</h4>
                <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1 mt-2">
                  {allergyWarnings.map((warning, index) => (
                    <li key={`allergy-confirm-${index}`}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            {interactionWarnings.length > 0 && (
              <div>
                <h4 className="font-medium text-yellow-800">Interaction Warnings:</h4>
                <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1 mt-2">
                  {interactionWarnings.map((warning, index) => (
                    <li key={`interaction-confirm-${index}`}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-sm text-gray-600 mt-4">
              Are you sure you want to proceed with this prescription despite these warnings?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={savePrescriptionData} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>Confirm and Save</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
