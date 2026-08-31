"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pill, Calendar, Clock, User, FileText } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

interface Medication {
  id: string
  name: string
  genericName?: string
  category?: string
  form: string
  strength: string
  route: string
  dosage: string
  frequency: string
  duration: string
  quantity: string
  refills: string
  instructions: string
}

interface Prescription {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  date: string
  medications: Medication[]
  notes?: string
  status: string
  urgent: boolean
  followUp: boolean
  followUpDate?: string
  followUpNotes?: string
}

interface PrescriptionHistoryProps {
  patientId: string
}

export default function PrescriptionHistory({ patientId }: PrescriptionHistoryProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPrescriptions = () => {
      setLoading(true)
      try {
        // Get prescriptions from localStorage
        const storedPrescriptions = localStorage.getItem("prescriptions")
        if (storedPrescriptions) {
          const allPrescriptions = JSON.parse(storedPrescriptions) as Prescription[]
          // Filter prescriptions for this patient
          const patientPrescriptions = allPrescriptions.filter((prescription) => prescription.patientId === patientId)
          // Sort by date (newest first)
          patientPrescriptions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          setPrescriptions(patientPrescriptions)
        }
      } catch (error) {
        console.error("Error fetching prescriptions:", error)
        toast({
          title: "Error",
          description: "Failed to load prescription history",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPrescriptions()
  }, [patientId, toast])

  const handlePrintPrescription = (prescriptionId: string) => {
    toast({
      title: "Print Requested",
      description: "Prescription has been sent to the printer",
    })
  }

  const handleViewDetails = (prescriptionId: string) => {
    toast({
      title: "View Details",
      description: "Viewing prescription details",
    })
    // In a real app, this would navigate to a detailed view or open a modal
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prescription History</CardTitle>
          <CardDescription>Loading prescription history...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (prescriptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prescription History</CardTitle>
          <CardDescription>View patient's medication prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Pill className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <h3 className="font-medium mb-1">No Prescriptions</h3>
            <p className="text-sm text-muted-foreground">This patient has no prescription history.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prescription History</CardTitle>
        <CardDescription>View patient's medication prescriptions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id} className="overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-muted">
                <div className="flex items-center space-x-2">
                  <Pill className="h-4 w-4 text-primary" />
                  <span className="font-medium">Prescription #{prescription.id.split("-")[1]}</span>
                </div>
                <Badge
                  variant={
                    prescription.urgent ? "destructive" : prescription.status === "Active" ? "default" : "secondary"
                  }
                >
                  {prescription.urgent ? "Urgent" : prescription.status}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{new Date(prescription.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{prescription.doctorName}</span>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="space-y-3">
                  <h4 className="font-medium">Medications</h4>
                  {prescription.medications.map((medication) => (
                    <div key={medication.id} className="p-3 bg-background rounded-md border">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">
                            {medication.name} {medication.strength}
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            {medication.form} • {medication.route} • {medication.frequency}
                          </p>
                        </div>
                        <div className="text-sm text-right">
                          <div>Qty: {medication.quantity}</div>
                          <div>Refills: {medication.refills}</div>
                        </div>
                      </div>
                      {medication.instructions && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Instructions: </span>
                          {medication.instructions}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {prescription.notes && (
                  <div className="mt-3">
                    <h4 className="font-medium">Notes</h4>
                    <p className="text-sm mt-1">{prescription.notes}</p>
                  </div>
                )}

                {prescription.followUp && (
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">Follow-up Required</h4>
                    </div>
                    {prescription.followUpDate && (
                      <p className="text-sm mt-1">
                        <span className="font-medium">Date: </span>
                        {new Date(prescription.followUpDate).toLocaleDateString()}
                      </p>
                    )}
                    {prescription.followUpNotes && (
                      <p className="text-sm mt-1">
                        <span className="font-medium">Notes: </span>
                        {prescription.followUpNotes}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(prescription.id)}>
                    <FileText className="h-4 w-4 mr-1" /> View Details
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handlePrintPrescription(prescription.id)}>
                    Print
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
