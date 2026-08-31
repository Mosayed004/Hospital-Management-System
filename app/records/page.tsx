"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, Filter, Download, Plus, LogOut } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import AuthGuard from "@/components/auth-guard"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function RecordsPage() {
  return (
    <AuthGuard allowedRoles={["doctor", "nurse", "admin"]}>
      <MedicalRecords />
    </AuthGuard>
  )
}

function MedicalRecords() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isNewRecordDialogOpen, setIsNewRecordDialogOpen] = useState(false)
  const [newRecord, setNewRecord] = useState({
    patientId: "",
    patientName: "",
    recordType: "",
    notes: "",
    attachments: "",
  })

  // Sample records data
  const [records, setRecords] = useState([
    {
      id: "MR-2025-0112",
      patient: "John Doe",
      recordType: "General Checkup",
      dateCreated: "05/05/2025",
      lastUpdated: "05/05/2025",
    },
    {
      id: "MR-2025-0113",
      patient: "Sarah Johnson",
      recordType: "Follow-up",
      dateCreated: "05/01/2025",
      lastUpdated: "05/05/2025",
    },
    {
      id: "MR-2025-0114",
      patient: "Michael Brown",
      recordType: "Cardiology Consultation",
      dateCreated: "04/28/2025",
      lastUpdated: "04/28/2025",
    },
    {
      id: "MR-2025-0115",
      patient: "Emily Wilson",
      recordType: "Dermatology Consultation",
      dateCreated: "04/15/2025",
      lastUpdated: "04/15/2025",
    },
  ])

  useEffect(() => {
    const storedRecords = localStorage.getItem("hms_medical_records")
    if (storedRecords) {
      try {
        setRecords(JSON.parse(storedRecords))
      } catch (error) {
        console.error("Error parsing stored records:", error)
      }
    }
  }, [])

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
  }

  const handleFilter = () => {
    toast({
      title: "Filter Applied",
      description: "Medical records have been filtered based on your criteria",
    })
  }

  const handleExportRecords = () => {
    toast({
      title: "Exporting Records",
      description: "Medical records are being exported",
    })
  }

  const handleViewRecord = (recordId: string) => {
    // Find the record by ID
    const record = records.find((r) => r.id === recordId)

    if (record) {
      toast({
        title: "Record Details",
        description: `Viewing details for record ${recordId} for ${record.patient}`,
      })

      // Navigate to the record detail page
      router.push(`/records/${recordId}`)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewRecord((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewRecord((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateRecord = () => {
    // Validate required fields
    if (!newRecord.patientName || !newRecord.recordType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Patient Name, Record Type)",
        variant: "destructive",
      })
      return
    }

    // Generate a new record ID
    const newId = `MR-2025-${Math.floor(1000 + Math.random() * 9000)}`

    // Create new record object
    const record = {
      id: newId,
      patient: newRecord.patientName || "New Patient",
      recordType: newRecord.recordType,
      dateCreated: new Date().toLocaleDateString(),
      lastUpdated: new Date().toLocaleDateString(),
    }

    // Add to records array
    const updatedRecords = [record, ...records]
    setRecords(updatedRecords)

    // Save to localStorage
    localStorage.setItem("hms_medical_records", JSON.stringify(updatedRecords))

    // Show success message
    toast({
      title: "Record Created",
      description: `Medical record ${record.id} has been created for ${record.patient}`,
    })

    // Reset form and close dialog
    setNewRecord({
      patientId: "",
      patientName: "",
      recordType: "",
      notes: "",
      attachments: "",
    })
    setIsNewRecordDialogOpen(false)
  }

  // Filter records based on search query
  const filteredRecords = records.filter(
    (record) =>
      record.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.recordType.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast({ title: "Help", description: "Opening help guide" })}
          >
            Help
          </Button>
          <Button size="sm">Medical Records</Button>
          <Button size="sm" variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Medical Records</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportRecords}>
              <Download className="mr-2 h-4 w-4" />
              Export Records
            </Button>
            <Dialog open={isNewRecordDialogOpen} onOpenChange={setIsNewRecordDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Record
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Create New Medical Record</DialogTitle>
                  <DialogDescription>Enter the details to create a new medical record.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientId">Patient ID</Label>
                      <Input
                        id="patientId"
                        name="patientId"
                        value={newRecord.patientId}
                        onChange={handleInputChange}
                        placeholder="e.g., P-2023-0584"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name</Label>
                      <Input
                        id="patientName"
                        name="patientName"
                        value={newRecord.patientName}
                        onChange={handleInputChange}
                        placeholder="e.g., John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recordType">Record Type</Label>
                    <Select
                      value={newRecord.recordType}
                      onValueChange={(value) => handleSelectChange("recordType", value)}
                    >
                      <SelectTrigger id="recordType">
                        <SelectValue placeholder="Select record type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General Checkup">General Checkup</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                        <SelectItem value="Lab Results">Lab Results</SelectItem>
                        <SelectItem value="Imaging">Imaging</SelectItem>
                        <SelectItem value="Procedure">Procedure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={newRecord.notes}
                      onChange={handleInputChange}
                      placeholder="Enter medical notes here"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attachments">Attachments</Label>
                    <Input id="attachments" name="attachments" type="file" onChange={handleInputChange} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewRecordDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRecord}>Create Record</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search records..."
                  className="w-full bg-background pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <Button variant="outline" size="icon" onClick={handleFilter}>
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </div>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Records</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="border-none p-0 pt-4">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Record ID</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Record Type</TableHead>
                          <TableHead>Date Created</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{record.id}</TableCell>
                            <TableCell>{record.patient}</TableCell>
                            <TableCell>{record.recordType}</TableCell>
                            <TableCell>{record.dateCreated}</TableCell>
                            <TableCell>{record.lastUpdated}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleViewRecord(record.id)}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t p-4">
                    <div className="text-xs text-muted-foreground">
                      Showing {filteredRecords.length} of {records.length} records
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        onClick={() =>
                          toast({ title: "Previous Page", description: "Loading previous page of results" })
                        }
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast({ title: "Next Page", description: "Loading next page of results" })}
                      >
                        Next
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="recent" className="border-none p-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Records</CardTitle>
                    <CardDescription>Records created or updated in the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      There are 42 records created or updated in the last 30 days.
                    </p>
                    <div className="mt-4">
                      <Button
                        onClick={() => {
                          toast({
                            title: "View Recent Records",
                            description: "Loading recently updated records",
                          })
                          // In a real app, this would load recent records
                        }}
                      >
                        View Recent Records
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="archived" className="border-none p-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Archived Records</CardTitle>
                    <CardDescription>Records that have been archived</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">There are 156 archived records in the system.</p>
                    <div className="mt-4">
                      <Button
                        onClick={() => {
                          toast({
                            title: "View Archived Records",
                            description: "Loading archived records",
                          })
                          // In a real app, this would load archived records
                        }}
                      >
                        View Archived Records
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
