import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  Users,
  CalendarClock,
  Pill,
  FlaskRoundIcon as Flask,
  CreditCard,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Activity,
  UserPlus,
  Stethoscope,
  Clipboard,
  ChevronRight,
} from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-primary mb-1">Welcome to Helwan National University Hospital</h1>
            <p className="text-muted-foreground">Hospital Management System Dashboard</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="dashboard-card dashboard-card-primary">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Patients</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <CardDescription>Total registered patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="stats-value">1,248</div>
                <div className="mt-2 stats-trend-up">
                  <TrendingUp className="h-3 w-3" />
                  <span>12% increase this month</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/patients" className="text-sm text-primary flex items-center hover:underline">
                  <span>View All Patients</span>
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="dashboard-card dashboard-card-secondary">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Appointments</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center">
                    <CalendarClock className="h-4 w-4 text-secondary" />
                  </div>
                </div>
                <CardDescription>Today's appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="stats-value">24</div>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>8 pending, 16 confirmed</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/appointments" className="text-sm text-primary flex items-center hover:underline">
                  <span>Manage Appointments</span>
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="dashboard-card dashboard-card-accent">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Pharmacy</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <Pill className="h-4 w-4 text-accent" />
                  </div>
                </div>
                <CardDescription>Medication inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="stats-value">342</div>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  <span>15 items low in stock</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/pharmacy" className="text-sm text-primary flex items-center hover:underline">
                  <span>View Inventory</span>
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="dashboard-card dashboard-card-success">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Lab Tests</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                    <Flask className="h-4 w-4 text-success" />
                  </div>
                </div>
                <CardDescription>Today's lab results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="stats-value">18</div>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  <span>12 completed, 6 pending</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/laboratory" className="text-sm text-primary flex items-center hover:underline">
                  <span>View Lab Results</span>
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Patients</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
                <CardDescription>Latest patient admissions and consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="patient-card flex items-center justify-between rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">Patient #{1000 + i}</div>
                          <div className="text-sm text-muted-foreground">Admitted: Today, 10:3{i} AM</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="status-badge-active">Active</div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used functions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Link href="/patients/new">
                    <Button className="w-full justify-start" variant="outline">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Register New Patient
                    </Button>
                  </Link>
                  <Link href="/appointments/new">
                    <Button className="w-full justify-start" variant="outline">
                      <CalendarClock className="mr-2 h-4 w-4" />
                      Schedule Appointment
                    </Button>
                  </Link>
                  <Link href="/doctor-dashboard">
                    <Button className="w-full justify-start" variant="outline">
                      <Stethoscope className="mr-2 h-4 w-4" />
                      Doctor Dashboard
                    </Button>
                  </Link>
                  <Link href="/records/new">
                    <Button className="w-full justify-start" variant="outline">
                      <Clipboard className="mr-2 h-4 w-4" />
                      Create Medical Record
                    </Button>
                  </Link>
                  <Link href="/pharmacy/new">
                    <Button className="w-full justify-start" variant="outline">
                      <Pill className="mr-2 h-4 w-4" />
                      Add Medication
                    </Button>
                  </Link>
                  <Link href="/laboratory/new">
                    <Button className="w-full justify-start" variant="outline">
                      <Flask className="mr-2 h-4 w-4" />
                      Order Lab Test
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2 lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Hospital Activity</CardTitle>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
                <CardDescription>Overview of hospital operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Department Activity</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Emergency</span>
                        <span className="text-sm font-medium">24 patients</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cardiology</span>
                        <span className="text-sm font-medium">18 patients</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pediatrics</span>
                        <span className="text-sm font-medium">15 patients</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Orthopedics</span>
                        <span className="text-sm font-medium">12 patients</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Doctor Availability</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">On duty</span>
                        <span className="text-sm font-medium">32 doctors</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">On call</span>
                        <span className="text-sm font-medium">14 doctors</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Available</span>
                        <span className="text-sm font-medium">28 doctors</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">On leave</span>
                        <span className="text-sm font-medium">8 doctors</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Financial Summary</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Today's Revenue</span>
                        <span className="text-sm font-medium">$12,450</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pending Payments</span>
                        <span className="text-sm font-medium">$8,320</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Insurance Claims</span>
                        <span className="text-sm font-medium">42 pending</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Bill</span>
                        <span className="text-sm font-medium">$420</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
