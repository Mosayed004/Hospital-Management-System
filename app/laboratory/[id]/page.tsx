"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Edit,
  Download,
  Upload,
  User,
  Calendar,
  FlaskRoundIcon as Flask,
  CheckCircle,
  AlertTriangle,
  FileText,
  Save,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LabTest {
  id: string
  patientName: string
  patientId: string
  testName: string
  testCode: string
  testType: string
  status: string
  priority: string
  orderedBy: string
  orderedDate: string
  scheduledDate: string
  completedDate?: string
  sampleType: string
  sampleCollectedBy?: string
  sampleCollectionTime?: string
  processedBy?: string
  results?: {
    parameter: string
    value: string
    unit: string
    referenceRange: string
    flag?: string
  }[]
  interpretation?: string
  notes?: string
  attachments?: {
    id: string
    name: string
    type: string
    uploadedBy: string
    uploadedDate: string
    url: string
  }[]
}

export default function LabTestDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [test, setTest] = useState<LabTest | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedTest, setEditedTest] = useState<Partial<LabTest>>({})
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false)
  const [newResult, setNewResult] = useState({
    parameter: "",
    value: "",
    unit: "",
    referenceRange: "",
    flag: "Normal",
  })

  useEffect(() => {
    // In a real application, this would be an API call
    // For now, we'll simulate fetching from localStorage
    const fetchTest = () => {
      setLoading(true)
      try {
        const storedTests = localStorage.getItem("labTests")
        if (storedTests) {
          const tests = JSON.parse(storedTests)
          const foundTest = tests.find((t: LabTest) => t.id === params.id)

          if (foundTest) {
            // Simulate a delay to show loading state
            setTimeout(() => {
              setTest(foundTest)
              setEditedTest(foundTest)
              setLoading(false)
            }, 500)
          } else {
            toast({
              title: "Test not found",
              description: "The requested laboratory test could not be found.",
              variant: "destructive",
            })
            router.push("/laboratory")
          }
        } else {
          // If no tests in storage, use mock data
          const mockTest: LabTest = {
            id: params.id as string,
            patientName: "John Doe",
            patientId: "P12345",
            testName: "Complete Blood Count (CBC)",
            testCode: "CBC-001",
            testType: "Hematology",
            status: "Completed",
            priority: "Routine",
            orderedBy: "Dr. Sarah Smith",
            orderedDate: "2023-05-10",
            scheduledDate: "2023-05-12",
            completedDate: "2023-05-12",
            sampleType: "Whole Blood",
            sampleCollectedBy: "Nurse Johnson",
            sampleCollectionTime: "2023-05-12 08:30 AM",
            processedBy: "Lab Tech Wilson",
            results: [
              {
                parameter: "White Blood Cell (WBC)",
                value: "8.5",
                unit: "x10^9/L",
                referenceRange: "4.0-11.0",
                flag: "Normal",
              },
              {
                parameter: "Red Blood Cell (RBC)",
                value: "5.2",
                unit: "x10^12/L",
                referenceRange: "4.5-5.5",
                flag: "Normal",
              },
              {
                parameter: "Hemoglobin (Hgb)",
                value: "14.2",
                unit: "g/dL",
                referenceRange: "13.5-17.5",
                flag: "Normal",
              },
              {
                parameter: "Hematocrit (Hct)",
                value: "42",
                unit: "%",
                referenceRange: "41-50",
                flag: "Normal",
              },
              {
                parameter: "Platelet Count",
                value: "180",
                unit: "x10^9/L",
                referenceRange: "150-400",
                flag: "Normal",
              },
            ],
            interpretation: "All parameters are within normal ranges. No significant abnormalities detected.",
            notes: "Patient fasting for 8 hours prior to sample collection.",
            attachments: [
              {
                id: "att-001",
                name: "CBC Report",
                type: "PDF",
                uploadedBy: "Lab Tech Wilson",
                uploadedDate: "2023-05-12",
                url: "/documents/cbc-report.pdf",
              },
            ],
          }

          // Save the mock test to localStorage
          localStorage.setItem("labTests", JSON.stringify([mockTest]))

          setTimeout(() => {
            setTest(mockTest)
            setEditedTest(mockTest)
            setLoading(false)
          }, 500)
        }
      } catch (error) {
        console.error("Error fetching lab test:", error)
        toast({
          title: "Error",
          description: "Failed to load laboratory test data. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchTest()
  }, [params.id, router, toast])

  const handleEditTest = () => {
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    try {
      // Update the test in state
      setTest((prev) => {
        if (!prev) return null
        return { ...prev, ...editedTest }
      })

      // Update the test in localStorage
      const storedTests = localStorage.getItem("labTests")
      if (storedTests) {
        const tests = JSON.parse(storedTests)
        const updatedTests = tests.map((t: LabTest) => (t.id === params.id ? { ...t, ...editedTest } : t))
        localStorage.setItem("labTests", JSON.stringify(updatedTests))
      }

      toast({
        title: "Test Updated",
        description: "Laboratory test has been successfully updated.",
      })
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating test:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update laboratory test. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedTest((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditedTest((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddResult = () => {
    if (!newResult.parameter || !newResult.value) {
      toast({
        title: "Missing Information",
        description: "Please provide at least parameter name and value.",
        variant: "destructive",
      })
      return
    }

    try {
      // Update the test in state
      setTest((prev) => {
        if (!prev) return null
        const updatedResults = prev.results ? [...prev.results, newResult] : [newResult]
        return { ...prev, results: updatedResults }
      })

      // Update the test in localStorage
      const storedTests = localStorage.getItem("labTests")
      if (storedTests) {
        const tests = JSON.parse(storedTests)
        const updatedTests = tests.map((t: LabTest) => {
          if (t.id === params.id) {
            const updatedResults = t.results ? [...t.results, newResult] : [newResult]
            return { ...t, results: updatedResults }
          }
          return t
        })
        localStorage.setItem("labTests", JSON.stringify(updatedTests))
      }

      toast({
        title: "Result Added",
        description: "New test result has been added successfully.",
      })

      // Reset the form
      setNewResult({
        parameter: "",
        value: "",
        unit: "",
        referenceRange: "",
        flag: "Normal",
      })
      setIsResultDialogOpen(false)
    } catch (error) {
      console.error("Error adding result:", error)
      toast({
        title: "Failed to Add Result",
        description: "An error occurred while adding the test result.",
        variant: "destructive",
      })
    }
  }

  const handleResultInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewResult((prev) => ({ ...prev, [name]: value }))
  }

  const handleResultSelectChange = (value: string) => {
    setNewResult((prev) => ({ ...prev, flag: value }))
  }

  const handleBackToList = () => {
    router.push("/laboratory")
  }

  const handleDownloadResults = () => {
    toast({
      title: "Download Results",
      description: `Downloading results for test: ${test?.testName}`,
    })
    // In a real app, this would download a PDF
  }

  const handleViewPatient = () => {
    router.push(`/patients/${test?.patientId}`)
  }

  const handleUploadResults = () => {
    setIsResultDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Laboratory
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Loading laboratory test...</CardTitle>
            <CardDescription>Please wait while we fetch the test details.</CardDescription>
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

  if (!test) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Laboratory
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Laboratory Test Not Found</CardTitle>
            <CardDescription>The requested laboratory test could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please return to the laboratory list and select a valid test.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleBackToList}>Return to Laboratory</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Ordered":
        return <Badge variant="outline">Ordered</Badge>
      case "Scheduled":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Scheduled</Badge>
      case "Sample Collected":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Sample Collected</Badge>
      case "In Progress":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">In Progress</Badge>
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return <Badge variant="destructive">Urgent</Badge>
      case "High":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">High</Badge>
      case "Routine":
        return <Badge variant="outline">Routine</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getResultFlagBadge = (flag?: string) => {
    if (!flag) return null

    switch (flag) {
      case "Normal":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Normal</Badge>
      case "High":
        return <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>
      case "Low":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Low</Badge>
      case "Critical High":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Critical High
          </Badge>
        )
      case "Critical Low":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Critical Low
          </Badge>
        )
      default:
        return <Badge variant="outline">{flag}</Badge>
    }
  }

  // Calculate progress based on status
  const getProgressValue = (status: string) => {
    switch (status) {
      case "Ordered":
        return 20
      case "Scheduled":
        return 40
      case "Sample Collected":
        return 60
      case "In Progress":
        return 80
      case "Completed":
        return 100
      default:
        return 0
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" onClick={handleBackToList}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Laboratory
        </Button>
        <div className="flex space-x-2">
          {test.status === "Completed" && (
            <Button variant="outline" size="sm" onClick={handleDownloadResults}>
              <Download className="h-4 w-4 mr-2" />
              Download Results
            </Button>
          )}
          <Button size="sm" onClick={handleEditTest}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Test
          </Button>
        </div>
      </div>

      {/* Edit Test Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Laboratory Test</DialogTitle>
            <DialogDescription>Update the details of this laboratory test.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testName">Test Name</Label>
                <Input id="testName" name="testName" value={editedTest.testName || ""} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testCode">Test Code</Label>
                <Input id="testCode" name="testCode" value={editedTest.testCode || ""} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testType">Test Type</Label>
                <Input id="testType" name="testType" value={editedTest.testType || ""} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={editedTest.status || ""} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ordered">Ordered</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Sample Collected">Sample Collected</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={editedTest.priority || ""}
                  onValueChange={(value) => handleSelectChange("priority", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Routine">Routine</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sampleType">Sample Type</Label>
                <Input
                  id="sampleType"
                  name="sampleType"
                  value={editedTest.sampleType || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sampleCollectedBy">Sample Collected By</Label>
                <Input
                  id="sampleCollectedBy"
                  name="sampleCollectedBy"
                  value={editedTest.sampleCollectedBy || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="processedBy">Processed By</Label>
                <Input
                  id="processedBy"
                  name="processedBy"
                  value={editedTest.processedBy || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interpretation">Interpretation</Label>
              <Textarea
                id="interpretation"
                name="interpretation"
                value={editedTest.interpretation || ""}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" value={editedTest.notes || ""} onChange={handleInputChange} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Result Dialog */}
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Test Result</DialogTitle>
            <DialogDescription>Enter a new result parameter for this test.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="parameter">Parameter Name</Label>
              <Input
                id="parameter"
                name="parameter"
                value={newResult.parameter}
                onChange={handleResultInputChange}
                placeholder="e.g., Hemoglobin"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  name="value"
                  value={newResult.value}
                  onChange={handleResultInputChange}
                  placeholder="e.g., 14.2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  name="unit"
                  value={newResult.unit}
                  onChange={handleResultInputChange}
                  placeholder="e.g., g/dL"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referenceRange">Reference Range</Label>
                <Input
                  id="referenceRange"
                  name="referenceRange"
                  value={newResult.referenceRange}
                  onChange={handleResultInputChange}
                  placeholder="e.g., 13.5-17.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="flag">Flag</Label>
                <Select value={newResult.flag} onValueChange={handleResultSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select flag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Critical High">Critical High</SelectItem>
                    <SelectItem value="Critical Low">Critical Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResultDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddResult}>Add Result</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">{test.testName}</CardTitle>
            <CardDescription>Test Code: {test.testCode}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Test Information</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Type:</div>
                  <div className="text-sm">{test.testType}</div>
                  <div className="text-sm font-medium">Status:</div>
                  <div className="text-sm">{getStatusBadge(test.status)}</div>
                  <div className="text-sm font-medium">Priority:</div>
                  <div className="text-sm">{getPriorityBadge(test.priority)}</div>
                  <div className="text-sm font-medium">Sample Type:</div>
                  <div className="text-sm">{test.sampleType}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Progress</h3>
                <Separator className="my-2" />
                <div className="space-y-2">
                  <Progress value={getProgressValue(test.status)} className="h-2" />
                  <div className="grid grid-cols-3 text-xs text-gray-500">
                    <div>Ordered</div>
                    <div className="text-center">Processing</div>
                    <div className="text-right">Completed</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Patient Information</h3>
                <Separator className="my-2" />
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium">Name:</div>
                    <div className="text-sm">{test.patientName}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Patient ID:</div>
                    <div className="text-sm">{test.patientId}</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={handleViewPatient}>
                    <User className="h-4 w-4 mr-2" />
                    View Patient Profile
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Order Information</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Ordered By:</div>
                  <div className="text-sm">{test.orderedBy}</div>
                  <div className="text-sm font-medium">Order Date:</div>
                  <div className="text-sm">{test.orderedDate}</div>
                  <div className="text-sm font-medium">Scheduled Date:</div>
                  <div className="text-sm">{test.scheduledDate}</div>
                  {test.completedDate && (
                    <>
                      <div className="text-sm font-medium">Completed Date:</div>
                      <div className="text-sm">{test.completedDate}</div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Button onClick={handleUploadResults}>
                  <Upload className="h-4 w-4 mr-2" />
                  {test.status === "Completed" ? "Add More Results" : "Upload Results"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            {test.status === "Completed" ? (
              <CardDescription>
                Results processed by {test.processedBy} on {test.completedDate}
              </CardDescription>
            ) : (
              <CardDescription>Results pending - Current status: {test.status}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="results">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="results">
                  <Flask className="h-4 w-4 mr-2" />
                  Results
                </TabsTrigger>
                <TabsTrigger value="sample">
                  <Calendar className="h-4 w-4 mr-2" />
                  Sample Details
                </TabsTrigger>
                <TabsTrigger value="attachments">
                  <Download className="h-4 w-4 mr-2" />
                  Attachments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="space-y-4">
                {test.results && test.results.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Parameter
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Result
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Unit
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Reference Range
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Flag
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {test.results.map((result, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {result.parameter}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.value}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.unit}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.referenceRange}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getResultFlagBadge(result.flag)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Flask className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Available</h3>
                    <p className="text-gray-500">
                      {test.status === "Completed"
                        ? "Results have been processed but no data is available."
                        : "This test is still in progress. Results will be available once completed."}
                    </p>
                  </div>
                )}

                {test.interpretation && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Interpretation</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm">{test.interpretation}</p>
                    </div>
                  </div>
                )}

                {test.notes && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm">{test.notes}</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sample" className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Sample Collection Details</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium">Sample Type:</p>
                      <p className="text-sm">{test.sampleType}</p>
                    </div>
                    {test.sampleCollectedBy && (
                      <div>
                        <p className="text-sm font-medium">Collected By:</p>
                        <p className="text-sm">{test.sampleCollectedBy}</p>
                      </div>
                    )}
                    {test.sampleCollectionTime && (
                      <div>
                        <p className="text-sm font-medium">Collection Time:</p>
                        <p className="text-sm">{test.sampleCollectionTime}</p>
                      </div>
                    )}
                    {test.processedBy && (
                      <div>
                        <p className="text-sm font-medium">Processed By:</p>
                        <p className="text-sm">{test.processedBy}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500">Sample Processing Timeline</h3>
                  <Separator className="my-2" />
                  <div className="space-y-4 mt-4">
                    <div className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div className="rounded-full h-8 w-8 flex items-center justify-center bg-green-100 text-green-800">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <div className="h-full w-0.5 bg-gray-200 mt-2"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Test Ordered</p>
                        <p className="text-xs text-gray-500">
                          {test.orderedDate} by {test.orderedBy}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div className="rounded-full h-8 w-8 flex items-center justify-center bg-green-100 text-green-800">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <div className="h-full w-0.5 bg-gray-200 mt-2"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Test Scheduled</p>
                        <p className="text-xs text-gray-500">{test.scheduledDate}</p>
                      </div>
                    </div>

                    {test.sampleCollectionTime && (
                      <div className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                          <div className="rounded-full h-8 w-8 flex items-center justify-center bg-green-100 text-green-800">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <div className="h-full w-0.5 bg-gray-200 mt-2"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Sample Collected</p>
                          <p className="text-xs text-gray-500">
                            {test.sampleCollectionTime} by {test.sampleCollectedBy}
                          </p>
                        </div>
                      </div>
                    )}

                    {test.status === "In Progress" && (
                      <div className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                          <div className="rounded-full h-8 w-8 flex items-center justify-center bg-yellow-100 text-yellow-800">
                            <AlertTriangle className="h-4 w-4" />
                          </div>
                          <div className="h-full w-0.5 bg-gray-200 mt-2"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Processing</p>
                          <p className="text-xs text-gray-500">Test is currently being processed</p>
                        </div>
                      </div>
                    )}

                    {test.completedDate && (
                      <div className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                          <div className="rounded-full h-8 w-8 flex items-center justify-center bg-green-100 text-green-800">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Test Completed</p>
                          <p className="text-xs text-gray-500">
                            {test.completedDate} by {test.processedBy}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attachments" className="space-y-4">
                {test.attachments && test.attachments.length > 0 ? (
                  <div className="space-y-4">
                    {test.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-8 w-8 mr-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{attachment.name}</p>
                            <p className="text-xs text-gray-500">
                              {attachment.type} • Uploaded on {attachment.uploadedDate} by {attachment.uploadedBy}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Attachments</h3>
                    <p className="text-gray-500">There are no attachments associated with this test.</p>
                  </div>
                )}

                {test.status === "Completed" && (
                  <div className="flex justify-center mt-6">
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New Attachment
                    </Button>
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
