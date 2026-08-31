"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Edit, Trash, AlertTriangle, Save, LogOut, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AuthGuard from "@/components/auth-guard"

export default function MedicalRecordPage() {
  return (
    <AuthGuard allowedRoles={["doctor", "nurse", "admin"]}>
      <MedicalRecordDetails />
    </AuthGuard>
  )
}

function MedicalRecordDetails() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [record, setRecord] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedRecord, setEditedRecord] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false)
  const [newNote, setNewNote] = useState({ content: "", type: "Progress Note" })

  // Get the record ID from the URL
  const recordId = params.id as string

  useEffect(() => {
    // Load records from localStorage
    const storedRecords = localStorage.getItem("hms_medical_records")
    if (storedRecords) {
      try {
        const records = JSON.parse(storedRecords)
        const foundRecord = records.find((r: any) => r.id === recordId)

        if (foundRecord) {
          // If the record doesn't have notes, add an empty array
          if (!foundRecord.notes) {
            foundRecord.notes = []
          }

          setRecord(foundRecord)
          setEditedRecord(JSON.parse(JSON.stringify(foundRecord))) // Deep copy
        } else {
          toast({
            title: "Record Not Found",
            description: `No medical record found with ID ${recordId}`,
            variant: "destructive",
          })
          // Redirect back to records page after a short delay
          setTimeout(() => router.push("/records"), 2000)
        }
      } catch (error) {
        console.error("Error parsing stored records:", error)
        toast({
          title: "Error",
          description: "Failed to load medical records data",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "No Records Data",
        description: "No medical records data found in storage",
        variant: "destructive",
      })
    }

    setLoading(false)
  }, [recordId, router, toast])

  const handleLogout = () => {
    localStorage.removeItem("hms_user")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/login")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedRecord((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleNoteInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewNote((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveChanges = () => {
    try {
      // Validate required fields
      if (!editedRecord.patient) {
        toast({
          title: "Missing Information",
          description: "Patient name is required.",
          variant: "destructive",
        })
        return
      }

      // Load current records
      const storedRecords = localStorage.getItem("hms_medical_records")
      if (storedRecords) {
        const records = JSON.parse(storedRecords)

        // Find the index of the record to update
        const recordIndex = records.findIndex((r: any) => r.id === recordId)

        if (recordIndex !== -1) {
          // Update the record
          records[recordIndex] = {
            ...editedRecord,
            lastUpdated: new Date().toLocaleDateString(),
          }

          // Save updated records back to localStorage
          localStorage.setItem("hms_medical_records", JSON.stringify(records))

          // Update local state
          setRecord(records[recordIndex])

          toast({
            title: "Changes Saved",
            description: `Medical record for ${editedRecord.patient} has been updated successfully`,
          })

          // Exit edit mode
          setIsEditing(false)
        }
      }
    } catch (error) {
      console.error("Error updating medical record:", error)
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRecord = () => {
    try {
      // Load current records
      const storedRecords = localStorage.getItem("hms_medical_records")
      if (storedRecords) {
        const records = JSON.parse(storedRecords)

        // Filter out the record to delete
        const updatedRecords = records.filter((r: any) => r.id !== recordId)

        // Save updated records back to localStorage
        localStorage.setItem("hms_medical_records", JSON.stringify(updatedRecords))

        toast({
          title: "Record Deleted",
          description: `Medical record for ${record.patient} has been deleted`,
        })

        // Close the dialog and redirect back to records page
        setIsDeleteDialogOpen(false)
        router.push("/records")
      }
    } catch (error) {
      console.error("Error deleting medical record:", error)
      toast({
        title: "Error",
        description: "Failed to delete record. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddNote = () => {
    if (!newNote.content) {
      toast({
        title: "Empty Note",
        description: "Please enter some content for the note",
        variant: "destructive",
      })
      return
    }

    try {
      // Load current records
      const storedRecords = localStorage.getItem("hms_medical_records")
      if (storedRecords) {
        const records = JSON.parse(storedRecords)

        // Find the index of the record to update
        const recordIndex = records.findIndex((r: any) => r.id === recordId)

        if (recordIndex !== -1) {
          // Create the new note
          const note = {
            id: `NOTE-${Date.now()}`,
            type: newNote.type,
            content: newNote.content,
            date: new Date().toLocaleDateString(),
            author: "Dr. John Smith", // In a real app, this would be the logged-in user
          }

          // Add the note to the record
          if (!records[recordIndex].notes) {
            records[recordIndex].notes = []
          }

          records[recordIndex].notes.unshift(note)
          records[recordIndex].lastUpdated = new Date().toLocaleDateString()

          // Save updated records back to localStorage
          localStorage.setItem("hms_medical_records", JSON.stringify(records))

          // Update local state
          setRecord(records[recordIndex])
          setEditedRecord(JSON.parse(JSON.stringify(records[recordIndex]))) // Deep copy

          toast({
            title: "Note Added",
            description: `A new ${newNote.type} has been added to the record`,
          })

          // Reset form and close dialog
          setNewNote({ content: "", type: "Progress Note" })
          setIsAddNoteDialogOpen(false)
        }
      }
    } catch (error) {
      console.error("Error adding note to medical record:", error)
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <div className="animate-pulse text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading Medical Record...</h2>
          <p className="text-muted-foreground">Please wait while we fetch the record</p>
        </div>
      </div>
    )
  }

  if (!record) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Record Not Found</h2>
          <p className="text-muted-foreground mb-4">The medical record you're looking for doesn't exist</p>
          <Button asChild>
            <Link href="/records">Return to Records</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 shadow-subtle">
        <Link href="/records" className="flex items-center gap-2 font-semibold">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Records</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm">
            Help
          </Button>
          <Button size="sm">Medical Staff</Button>
          <Button size="sm" variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Medical Record: {record.id}</h1>
            <Badge variant="outline">{record.recordType}</Badge>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <Button onClick={handleSaveChanges}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Record
                </Button>
                <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Record
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>Basic details about the patient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient Name</Label>
                {isEditing ? (
                  <Input id="patient" name="patient" value={editedRecord.patient} onChange={handleInputChange} />
                ) : (
                  <div className="rounded-md border px-3 py-2 text-sm">{record.patient}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                {isEditing ? (
                  <Input
                    id="patientId"
                    name="patientId"
                    value={editedRecord.patientId || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="rounded-md border px-3 py-2 text-sm">{record.patientId || "Not specified"}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="recordType">Record Type</Label>
                {isEditing ? (
                  <Input
                    id="recordType"
                    name="recordType"
                    value={editedRecord.recordType}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="rounded-md border px-3 py-2 text-sm">{record.recordType}</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Record Details</CardTitle>
              <CardDescription>Information about this medical record</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dateCreated">Date Created</Label>
                <div className="rounded-md border px-3 py-2 text-sm">{record.dateCreated}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastUpdated">Last Updated</Label>
                <div className="rounded-md border px-3 py-2 text-sm">{record.lastUpdated}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                {isEditing ? (
                  <Input
                    id="diagnosis"
                    name="diagnosis"
                    value={editedRecord.diagnosis || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="rounded-md border px-3 py-2 text-sm">
                    {record.diagnosis || "No diagnosis recorded"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Notes & Observations</CardTitle>
              <CardDescription>Clinical notes and observations for this patient</CardDescription>
            </div>
            <Button onClick={() => setIsAddNoteDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Notes</TabsTrigger>
                <TabsTrigger value="progress">Progress Notes</TabsTrigger>
                <TabsTrigger value="lab">Lab Results</TabsTrigger>
                <TabsTrigger value="medication">Medications</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="border-none p-0 pt-4">
                {record.notes && record.notes.length > 0 ? (
                  <div className="space-y-4">
                    {record.notes.map((note: any) => (
                      <div key={note.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{note.type}</Badge>
                          <span className="text-xs text-muted-foreground">{note.date}</span>
                        </div>
                        <p className="text-sm mb-2">{note.content}</p>
                        <p className="text-xs text-muted-foreground">Added by: {note.author}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">No Notes Yet</h3>
                    <p className="text-muted-foreground mb-4">There are no notes for this medical record yet.</p>
                    <Button onClick={() => setIsAddNoteDialogOpen(true)}>Add First Note</Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="progress" className="border-none p-0 pt-4">
                {record.notes && record.notes.filter((note: any) => note.type === "Progress Note").length > 0 ? (
                  <div className="space-y-4">
                    {record.notes
                      .filter((note: any) => note.type === "Progress Note")
                      .map((note: any) => (
                        <div key={note.id} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{note.type}</Badge>
                            <span className="text-xs text-muted-foreground">{note.date}</span>
                          </div>
                          <p className="text-sm mb-2">{note.content}</p>
                          <p className="text-xs text-muted-foreground">Added by: {note.author}</p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No progress notes available</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="lab" className="border-none p-0 pt-4">
                {record.notes && record.notes.filter((note: any) => note.type === "Lab Result").length > 0 ? (
                  <div className="space-y-4">
                    {record.notes
                      .filter((note: any) => note.type === "Lab Result")
                      .map((note: any) => (
                        <div key={note.id} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{note.type}</Badge>
                            <span className="text-xs text-muted-foreground">{note.date}</span>
                          </div>
                          <p className="text-sm mb-2">{note.content}</p>
                          <p className="text-xs text-muted-foreground">Added by: {note.author}</p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No lab results available</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="medication" className="border-none p-0 pt-4">
                {record.notes && record.notes.filter((note: any) => note.type === "Medication").length > 0 ? (
                  <div className="space-y-4">
                    {record.notes
                      .filter((note: any) => note.type === "Medication")
                      .map((note: any) => (
                        <div key={note.id} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{note.type}</Badge>
                            <span className="text-xs text-muted-foreground">{note.date}</span>
                          </div>
                          <p className="text-sm mb-2">{note.content}</p>
                          <p className="text-xs text-muted-foreground">Added by: {note.author}</p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No medication notes available</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the medical record for {record.patient}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRecord}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={isAddNoteDialogOpen} onOpenChange={setIsAddNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Note</DialogTitle>
            <DialogDescription>Add a new note to this medical record</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type">Note Type</Label>
              <select
                id="type"
                name="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newNote.type}
                onChange={(e) => setNewNote({ ...newNote, type: e.target.value })}
              >
                <option value="Progress Note">Progress Note</option>
                <option value="Consultation">Consultation</option>
                <option value="Lab Result">Lab Result</option>
                <option value="Medication">Medication</option>
                <option value="Procedure">Procedure</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Note Content</Label>
              <Textarea
                id="content"
                name="content"
                value={newNote.content}
                onChange={handleNoteInputChange}
                placeholder="Enter note details here..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddNoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote}>Add Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
