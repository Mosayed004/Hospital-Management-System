"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, FlaskRoundIcon as Flask, Pill, CalendarDays, ClipboardList, LogOut } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import AuthGuard from "@/components/auth-guard"

export default function DoctorDashboardPage() {
  return (
    <AuthGuard allowedRoles={["doctor", "admin"]}>
      <DoctorDashboard />
    </AuthGuard>
  )
}

function DoctorDashboard() {
  const router = useRouter()
  const [activePatient, setActivePatient] = useState("Sarah Johnson")

  const handleLogout = () => {
    localStorage.removeItem("hms_user")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/login")
  }

  const handleStartConsultation = () => {
    // Navigate to the consultation page with the patient ID
    router.push(`/doctor-dashboard/consultation?patientId=2&appointmentId=a2`)
  }

  const handleViewRecords = () => {
    // Navigate to the patient records page
    router.push(`/records/2`)
  }

  const handleReviewResults = () => {
    // Navigate to the laboratory results page
    router.push(`/laboratory/l1`)
  }

  const handlePrescribeMedication = () => {
    // Navigate to the prescription page with the patient ID
    router.push(`/doctor-dashboard/prescribe?patientId=2`)
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
          <Button size="sm">Dr. Williams</Button>
          <Button size="sm" variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleViewRecords}>
              <FileText className="mr-2 h-4 w-4" />
              Patient Records
            </Button>
            <Button onClick={handlePrescribeMedication}>
              <Pill className="mr-2 h-4 w-4" />
              Prescribe Medication
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients Today</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">2 more than yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10:30 AM</div>
              <p className="text-xs text-muted-foreground">Sarah Johnson - Follow-up</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Lab Results</CardTitle>
              <Flask className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">1 urgent priority</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prescriptions Today</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">2 renewals</p>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="patients">
          <TabsList>
            <TabsTrigger value="patients">Today's Patients</TabsTrigger>
            <TabsTrigger value="lab">Lab Results</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          </TabsList>
          <TabsContent value="patients" className="border-none p-0 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Patient Schedule</CardTitle>
                <CardDescription>Patients scheduled for May 5, 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">9:00 AM - Completed</div>
                      <div className="text-xs font-medium text-green-500 bg-green-50 rounded-full px-2 py-1">
                        Checked Out
                      </div>
                    </div>
                    <div className="mt-2 text-sm">John Doe (P-2023-0584)</div>
                    <div className="text-xs text-muted-foreground">General Checkup</div>
                  </div>
                  <div className="rounded-lg border p-3 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">10:30 AM - Current</div>
                      <div className="text-xs font-medium text-blue-500 bg-blue-50 rounded-full px-2 py-1">
                        In Progress
                      </div>
                    </div>
                    <div className="mt-2 text-sm">Sarah Johnson (P-2023-0632)</div>
                    <div className="text-xs text-muted-foreground">Follow-up Appointment</div>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="outline" onClick={handleViewRecords}>
                        View Records
                      </Button>
                      <Button size="sm" onClick={handleStartConsultation}>
                        Start Consultation
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">1:15 PM</div>
                      <div className="text-xs font-medium text-yellow-500 bg-yellow-50 rounded-full px-2 py-1">
                        Waiting
                      </div>
                    </div>
                    <div className="mt-2 text-sm">Michael Brown (P-2023-0421)</div>
                    <div className="text-xs text-muted-foreground">Cardiology Consultation</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">3:45 PM</div>
                      <div className="text-xs font-medium text-gray-500 bg-gray-50 rounded-full px-2 py-1">
                        Scheduled
                      </div>
                    </div>
                    <div className="mt-2 text-sm">Emily Wilson (P-2023-0745)</div>
                    <div className="text-xs text-muted-foreground">Dermatology Consultation</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "View Full Schedule",
                      description: "Loading complete schedule for today",
                    })
                    // In a real app, this would load the full schedule
                  }}
                >
                  View Full Schedule
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="lab" className="border-none p-0 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Lab Results</CardTitle>
                <CardDescription>Lab results requiring your review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-3 border-red-200 bg-red-50">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Blood Work</div>
                      <div className="text-xs font-medium text-red-500 bg-red-100 rounded-full px-2 py-1">
                        Urgent Review
                      </div>
                    </div>
                    <div className="mt-2 text-sm">Robert Garcia (P-2023-0891)</div>
                    <div className="text-xs text-muted-foreground">Abnormal CBC results</div>
                    <div className="mt-2">
                      <Button size="sm" onClick={handleReviewResults}>
                        Review Results
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Urinalysis</div>
                      <div className="text-xs font-medium text-yellow-500 bg-yellow-50 rounded-full px-2 py-1">
                        Pending Review
                      </div>
                    </div>
                    <div className="mt-2 text-sm">John Doe (P-2023-0584)</div>
                    <div className="text-xs text-muted-foreground">Completed today</div>
                    <div className="mt-2">
                      <Button size="sm" variant="outline" onClick={handleReviewResults}>
                        Review Results
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">X-Ray Results</div>
                      <div className="text-xs font-medium text-yellow-500 bg-yellow-50 rounded-full px-2 py-1">
                        Pending Review
                      </div>
                    </div>
                    <div className="mt-2 text-sm">Sarah Johnson (P-2023-0632)</div>
                    <div className="text-xs text-muted-foreground">Chest X-Ray from 05/01/2025</div>
                    <div className="mt-2">
                      <Button size="sm" variant="outline" onClick={handleReviewResults}>
                        Review Results
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    toast({
                      title: "View All Lab Results",
                      description: "Loading complete lab results history",
                    })
                  }
                >
                  View All Lab Results
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="prescriptions" className="border-none p-0 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Prescriptions</CardTitle>
                <CardDescription>Prescriptions issued in the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Amoxicillin 500mg</div>
                      <div className="text-xs font-medium text-green-500 bg-green-50 rounded-full px-2 py-1">
                        Issued
                      </div>
                    </div>
                    <div className="mt-2 text-sm">John Doe (P-2023-0584)</div>
                    <div className="text-xs text-muted-foreground">1 capsule 3 times daily for 7 days</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Lisinopril 10mg</div>
                      <div className="text-xs font-medium text-green-500 bg-green-50 rounded-full px-2 py-1">
                        Renewed
                      </div>
                    </div>
                    <div className="mt-2 text-sm">Michael Brown (P-2023-0421)</div>
                    <div className="text-xs text-muted-foreground">1 tablet daily, 30 day supply</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Prednisone 20mg</div>
                      <div className="text-xs font-medium text-green-500 bg-green-50 rounded-full px-2 py-1">
                        Issued
                      </div>
                    </div>
                    <div className="mt-2 text-sm">Emily Wilson (P-2023-0745)</div>
                    <div className="text-xs text-muted-foreground">Tapering dose over 10 days</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    toast({
                      title: "View All Prescriptions",
                      description: "Loading complete prescription history",
                    })
                  }
                >
                  View All Prescriptions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
