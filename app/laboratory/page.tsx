"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, Filter, Upload, Download, LogOut } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"

export default function LaboratoryPage() {
  return (
    <AuthGuard allowedRoles={["lab", "doctor", "admin"]}>
      <LaboratoryModule />
    </AuthGuard>
  )
}

function LaboratoryModule() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    testId: "",
    patientId: "",
    testType: "",
    results: "",
    notes: "",
  })

  const handleLogout = () => {
    localStorage.removeItem("hms_user")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/login")
  }

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      toast({
        title: "Search Error",
        description: "Please enter a search term",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Searching Tests",
      description: `Searching for "${searchQuery}"`,
    })
  }

  const handleFilter = () => {
    toast({
      title: "Filter Applied",
      description: "Filtering test records",
    })
  }

  const handleDownload = () => {
    toast({
      title: "Downloading Records",
      description: "Test records are being downloaded",
    })
  }

  const handleProcessTest = (testId: string) => {
    toast({
      title: "Processing Test",
      description: `Processing test ID: ${testId}`,
    })

    // Navigate to the test detail page
    router.push(`/laboratory/${testId}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUploadForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUploadResults = () => {
    // Validate form
    if (!uploadForm.testId || !uploadForm.results) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Results Uploaded",
      description: `Successfully uploaded results for test ID: ${uploadForm.testId}`,
    })

    // Close dialog and reset form
    setIsUploadDialogOpen(false)
    setUploadForm({
      testId: "",
      patientId: "",
      testType: "",
      results: "",
      notes: "",
    })
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm">
            Help
          </Button>
          <Button size="sm">Lab Tech</Button>
          <Button size="sm" variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Laboratory Module</h1>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Results
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Upload Test Results</DialogTitle>
                <DialogDescription>Enter test results to update patient records.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="testId">Test ID *</Label>
                    <Input id="testId" name="testId" value={uploadForm.testId} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input id="patientId" name="patientId" value={uploadForm.patientId} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testType">Test Type</Label>
                  <Input id="testType" name="testType" value={uploadForm.testType} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="results">Results *</Label>
                  <Textarea
                    id="results"
                    name="results"
                    rows={4}
                    value={uploadForm.results}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea id="notes" name="notes" rows={2} value={uploadForm.notes} onChange={handleInputChange} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUploadResults}>Upload Results</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tests..."
                  className="w-full bg-background pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button variant="outline" size="icon" onClick={handleFilter}>
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </div>
            <Tabs defaultValue="pending">
              <TabsList>
                <TabsTrigger value="pending">Pending Tests</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="all">All Tests</TabsTrigger>
              </TabsList>
              <TabsContent value="pending" className="border-none p-0 pt-4">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Test ID</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Test Type</TableHead>
                          <TableHead>Ordered By</TableHead>
                          <TableHead>Date Ordered</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>T-2025-0112</TableCell>
                          <TableCell>Robert Garcia</TableCell>
                          <TableCell>Complete Blood Count</TableCell>
                          <TableCell>Dr. Williams</TableCell>
                          <TableCell>05/04/2025</TableCell>
                          <TableCell>
                            <span className="text-xs font-medium text-red-500 bg-red-50 rounded-full px-2 py-1">
                              Urgent
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => handleProcessTest("T-2025-0112")}>
                              Process
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>T-2025-0113</TableCell>
                          <TableCell>John Doe</TableCell>
                          <TableCell>Urinalysis</TableCell>
                          <TableCell>Dr. Williams</TableCell>
                          <TableCell>05/05/2025</TableCell>
                          <TableCell>
                            <span className="text-xs font-medium text-yellow-500 bg-yellow-50 rounded-full px-2 py-1">
                              Normal
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => handleProcessTest("T-2025-0113")}>
                              Process
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>T-2025-0114</TableCell>
                          <TableCell>Sarah Johnson</TableCell>
                          <TableCell>Chest X-Ray</TableCell>
                          <TableCell>Dr. Williams</TableCell>
                          <TableCell>05/01/2025</TableCell>
                          <TableCell>
                            <span className="text-xs font-medium text-yellow-500 bg-yellow-50 rounded-full px-2 py-1">
                              Normal
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => handleProcessTest("T-2025-0114")}>
                              Process
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t p-4">
                    <div className="text-xs text-muted-foreground">Showing 3 of 18 pending tests</div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        onClick={() => {
                          toast({
                            title: "Previous Page",
                            description: "Loading previous page of results",
                          })
                          // In a real app, this would load the previous page of tests
                        }}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Next Page",
                            description: "Loading next page of results",
                          })
                          // In a real app, this would load the next page of tests
                        }}
                      >
                        Next
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="completed" className="border-none p-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Completed Tests</CardTitle>
                    <CardDescription>Tests that have been processed and results uploaded</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">There are 42 completed tests in the last 30 days.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="all" className="border-none p-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>All Tests</CardTitle>
                    <CardDescription>Complete history of laboratory tests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">There are 156 tests in the system.</p>
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
