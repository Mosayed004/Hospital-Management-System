"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Download,
  LogOut,
  FileText,
  Printer,
  Share2,
  Calendar,
  Users,
  DollarSign,
  Stethoscope,
  PieChart,
  BarChart,
  FileSpreadsheet,
  FileIcon as FilePdf,
  FileTextIcon,
  Star,
  Clock,
  Filter,
} from "lucide-react"
import {
  Bar,
  BarChart as RechartsBarChart,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart as RechartsAreaChart,
} from "recharts"
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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DatePickerWithRange } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"

export default function ReportsPage() {
  return (
    <AuthGuard allowedRoles={["admin", "billing", "doctor"]}>
      <ReportDashboard />
    </AuthGuard>
  )
}

// Sample data for dashboard metrics
const dashboardMetrics = {
  patientVisits: {
    total: 1245,
    change: 8.2,
    trend: "up",
  },
  revenue: {
    total: 287650,
    change: 12.5,
    trend: "up",
  },
  occupancyRate: {
    total: 78.3,
    change: -2.1,
    trend: "down",
  },
  averageStay: {
    total: 4.2,
    change: -0.5,
    trend: "down",
  },
}

// Sample data for charts
const patientData = [
  { name: "Jan", patients: 65, outpatient: 40, inpatient: 25 },
  { name: "Feb", patients: 59, outpatient: 35, inpatient: 24 },
  { name: "Mar", patients: 80, outpatient: 50, inpatient: 30 },
  { name: "Apr", patients: 81, outpatient: 55, inpatient: 26 },
  { name: "May", patients: 56, outpatient: 36, inpatient: 20 },
  { name: "Jun", patients: 55, outpatient: 35, inpatient: 20 },
  { name: "Jul", patients: 40, outpatient: 25, inpatient: 15 },
]

const revenueData = [
  { name: "Jan", revenue: 24000, expenses: 18000, profit: 6000 },
  { name: "Feb", revenue: 18000, expenses: 15000, profit: 3000 },
  { name: "Mar", revenue: 32000, expenses: 22000, profit: 10000 },
  { name: "Apr", revenue: 27000, expenses: 19000, profit: 8000 },
  { name: "May", revenue: 43000, expenses: 28000, profit: 15000 },
  { name: "Jun", revenue: 38000, expenses: 25000, profit: 13000 },
  { name: "Jul", revenue: 35000, expenses: 23000, profit: 12000 },
]

const departmentData = [
  { name: "General Medicine", value: 35 },
  { name: "Cardiology", value: 20 },
  { name: "Pediatrics", value: 15 },
  { name: "Orthopedics", value: 10 },
  { name: "Neurology", value: 20 },
]

const staffPerformanceData = [
  { name: "Dr. Smith", patients: 120, satisfaction: 92, efficiency: 88 },
  { name: "Dr. Johnson", patients: 95, satisfaction: 88, efficiency: 90 },
  { name: "Dr. Williams", patients: 105, satisfaction: 95, efficiency: 85 },
  { name: "Dr. Brown", patients: 85, satisfaction: 90, efficiency: 92 },
  { name: "Dr. Jones", patients: 110, satisfaction: 87, efficiency: 89 },
]

const inventoryData = [
  { name: "Medications", stock: 85, usage: 65, reorder: 20 },
  { name: "Surgical Supplies", stock: 70, usage: 55, reorder: 30 },
  { name: "Lab Supplies", stock: 90, usage: 40, reorder: 15 },
  { name: "Office Supplies", stock: 95, usage: 30, reorder: 10 },
  { name: "Equipment", stock: 60, usage: 45, reorder: 25 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

// Sample favorite reports
const favoriteReports = [
  { id: 1, name: "Monthly Revenue Summary", type: "financial", format: "chart", lastRun: "2023-07-15" },
  { id: 2, name: "Department Performance", type: "staff", format: "table", lastRun: "2023-07-10" },
  { id: 3, name: "Patient Demographics", type: "patient", format: "chart", lastRun: "2023-07-12" },
]

// Sample recent reports
const recentReports = [
  { id: 4, name: "Inventory Status", type: "inventory", format: "table", lastRun: "2023-07-16" },
  { id: 5, name: "Weekly Patient Visits", type: "patient", format: "chart", lastRun: "2023-07-15" },
  { id: 6, name: "Staff Efficiency", type: "staff", format: "chart", lastRun: "2023-07-14" },
]

function ReportDashboard() {
  const router = useRouter()
  const [reportType, setReportType] = useState("patient")
  const [timePeriod, setTimePeriod] = useState("month")
  const [reportFormat, setReportFormat] = useState("chart")
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<null | {
    title: string
    description: string
    date: string
    type: string
  }>(null)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [showFilterDialog, setShowFilterDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  })
  const [compareWithPrevious, setCompareWithPrevious] = useState(false)
  const [showRawData, setShowRawData] = useState(false)
  const [exportFormat, setExportFormat] = useState("pdf")
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(["All"])

  // Load saved reports from localStorage
  const [savedReports, setSavedReports] = useState<any[]>([])

  useEffect(() => {
    // Simulate loading saved reports from localStorage
    const loadSavedReports = () => {
      const storedReports = localStorage.getItem("hms_saved_reports")
      if (storedReports) {
        setSavedReports(JSON.parse(storedReports))
      } else {
        // Initialize with some sample saved reports
        const initialReports = [...favoriteReports, ...recentReports]
        localStorage.setItem("hms_saved_reports", JSON.stringify(initialReports))
        setSavedReports(initialReports)
      }
    }

    loadSavedReports()
  }, [])

  // Simulate progress for report generation
  useEffect(() => {
    if (isGeneratingReport) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer)
            return 100
          }
          return prevProgress + 10
        })
      }, 200)

      return () => {
        clearInterval(timer)
      }
    } else {
      setProgress(0)
    }
  }, [isGeneratingReport])

  const handleLogout = () => {
    localStorage.removeItem("hms_user")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    router.push("/login")
  }

  const handleExportReports = () => {
    setIsGeneratingReport(true)
    setProgress(0)

    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false)
      setProgress(100)

      const report = {
        title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
        description: `${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}ly report on ${reportType} data`,
        date: new Date().toLocaleDateString(),
        type: reportFormat,
      }

      setGeneratedReport(report)
      setShowReportDialog(true)

      toast({
        title: "Report Generated",
        description: `${report.title} has been generated successfully`,
      })
    }, 2000)
  }

  const handleDownloadReport = (reportName: string) => {
    toast({
      title: "Downloading Report",
      description: `Downloading ${reportName} report in ${exportFormat.toUpperCase()} format`,
    })

    // In a real app, this would generate and download the specific report
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${reportName} report has been downloaded`,
      })
    }, 1500)
  }

  const handleReportTypeChange = (value: string) => {
    setReportType(value)
    toast({
      title: "Report Type Changed",
      description: `Switched to ${value} reports`,
    })
  }

  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value)
    toast({
      title: "Time Period Changed",
      description: `Switched to ${value} time period`,
    })
  }

  const handleFormatChange = (value: string) => {
    setReportFormat(value)
    toast({
      title: "Format Changed",
      description: `Switched to ${value} format`,
    })
  }

  const handlePrintReport = () => {
    toast({
      title: "Printing Report",
      description: "Sending report to printer",
    })

    setTimeout(() => {
      toast({
        title: "Print Job Sent",
        description: "Report has been sent to the printer",
      })
    }, 1500)
  }

  const handleShareReport = () => {
    toast({
      title: "Sharing Report",
      description: "Opening share options",
    })

    setTimeout(() => {
      toast({
        title: "Report Shared",
        description: "Report has been shared successfully",
      })
    }, 1500)
  }

  const handleSaveReport = () => {
    // Generate a unique ID for the new report
    const newReportId = Date.now()

    const newReport = {
      id: newReportId,
      name: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} ${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}ly Report`,
      type: reportType,
      format: reportFormat,
      lastRun: new Date().toISOString().split("T")[0],
    }

    const updatedReports = [...savedReports, newReport]
    localStorage.setItem("hms_saved_reports", JSON.stringify(updatedReports))
    setSavedReports(updatedReports)

    toast({
      title: "Report Saved",
      description: "Your report configuration has been saved for future use",
    })
  }

  const handleScheduleReport = () => {
    setShowScheduleDialog(true)
  }

  const handleConfirmSchedule = () => {
    setShowScheduleDialog(false)

    toast({
      title: "Report Scheduled",
      description: "Your report has been scheduled for automatic generation",
    })
  }

  const handleOpenFilters = () => {
    setShowFilterDialog(true)
  }

  const handleApplyFilters = () => {
    setShowFilterDialog(false)

    toast({
      title: "Filters Applied",
      description: "Your report filters have been updated",
    })
  }

  const handleRunSavedReport = (report: any) => {
    setReportType(report.type)
    setReportFormat(report.format)

    toast({
      title: "Loading Saved Report",
      description: `Loading ${report.name}`,
    })

    setTimeout(() => {
      handleExportReports()
    }, 500)
  }

  const handleDeleteSavedReport = (reportId: number) => {
    const updatedReports = savedReports.filter((report) => report.id !== reportId)
    localStorage.setItem("hms_saved_reports", JSON.stringify(updatedReports))
    setSavedReports(updatedReports)

    toast({
      title: "Report Deleted",
      description: "The saved report has been deleted",
    })
  }

  const getIconForReportType = (type: string) => {
    switch (type) {
      case "patient":
        return <Users className="h-4 w-4" />
      case "financial":
        return <DollarSign className="h-4 w-4" />
      case "inventory":
        return <FileSpreadsheet className="h-4 w-4" />
      case "staff":
        return <Stethoscope className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getIconForReportFormat = (format: string) => {
    switch (format) {
      case "chart":
        return <BarChart className="h-4 w-4" />
      case "table":
        return <FileSpreadsheet className="h-4 w-4" />
      case "summary":
        return <FileTextIcon className="h-4 w-4" />
      case "detailed":
        return <FilePdf className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

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
          <Button size="sm">Admin</Button>
          <Button size="sm" variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Reports Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleOpenFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" onClick={handleScheduleReport}>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button onClick={handleExportReports} disabled={isGeneratingReport}>
              {isGeneratingReport ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </div>

        {isGeneratingReport && (
          <div className="w-full space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Generating report...</span>
              <span className="text-sm">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reports">Report Builder</TabsTrigger>
            <TabsTrigger value="saved">Saved Reports</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Patient Visits</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardMetrics.patientVisits.total.toLocaleString()}</div>
                  <p
                    className={`text-xs ${dashboardMetrics.patientVisits.trend === "up" ? "text-green-500" : "text-red-500"}`}
                  >
                    {dashboardMetrics.patientVisits.trend === "up" ? "+" : ""}
                    {dashboardMetrics.patientVisits.change}% from last period
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${dashboardMetrics.revenue.total.toLocaleString()}</div>
                  <p
                    className={`text-xs ${dashboardMetrics.revenue.trend === "up" ? "text-green-500" : "text-red-500"}`}
                  >
                    {dashboardMetrics.revenue.trend === "up" ? "+" : ""}
                    {dashboardMetrics.revenue.change}% from last period
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bed Occupancy Rate</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardMetrics.occupancyRate.total}%</div>
                  <p
                    className={`text-xs ${dashboardMetrics.occupancyRate.trend === "up" ? "text-green-500" : "text-red-500"}`}
                  >
                    {dashboardMetrics.occupancyRate.trend === "up" ? "+" : ""}
                    {dashboardMetrics.occupancyRate.change}% from last period
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Length of Stay</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardMetrics.averageStay.total} days</div>
                  <p
                    className={`text-xs ${dashboardMetrics.averageStay.trend === "up" ? "text-red-500" : "text-green-500"}`}
                  >
                    {dashboardMetrics.averageStay.trend === "up" ? "+" : ""}
                    {dashboardMetrics.averageStay.change} days from last period
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Patient Visits Trend</CardTitle>
                  <CardDescription>Monthly patient visits over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsAreaChart
                      data={patientData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="outpatient"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                        name="Outpatient"
                      />
                      <Area
                        type="monotone"
                        dataKey="inpatient"
                        stackId="1"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        name="Inpatient"
                      />
                    </RechartsAreaChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDownloadReport("Patient Visits Trend")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Chart
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Distribution</CardTitle>
                  <CardDescription>Patient distribution by department</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDownloadReport("Department Distribution")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Chart
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue vs Expenses</CardTitle>
                  <CardDescription>Monthly financial performance</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={revenueData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, ""]} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                      <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
                      <Bar dataKey="profit" fill="#ffc658" name="Profit" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDownloadReport("Financial Performance")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Chart
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Staff Performance</CardTitle>
                  <CardDescription>Efficiency and satisfaction metrics</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={staffPerformanceData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="satisfaction" fill="#8884d8" name="Satisfaction %" />
                      <Bar dataKey="efficiency" fill="#82ca9d" name="Efficiency %" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDownloadReport("Staff Performance")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Chart
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Report Builder Tab */}
          <TabsContent value="reports" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Report Type</CardTitle>
                  <CardDescription>Select the type of report to generate</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select defaultValue={reportType} onValueChange={handleReportTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient Statistics</SelectItem>
                      <SelectItem value="financial">Financial Reports</SelectItem>
                      <SelectItem value="inventory">Inventory Status</SelectItem>
                      <SelectItem value="staff">Staff Performance</SelectItem>
                      <SelectItem value="clinical">Clinical Outcomes</SelectItem>
                      <SelectItem value="quality">Quality Metrics</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Time Period</CardTitle>
                  <CardDescription>Select the time period for the report</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select defaultValue={timePeriod} onValueChange={handleTimePeriodChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Daily</SelectItem>
                      <SelectItem value="week">Weekly</SelectItem>
                      <SelectItem value="month">Monthly</SelectItem>
                      <SelectItem value="quarter">Quarterly</SelectItem>
                      <SelectItem value="year">Yearly</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>

                  {timePeriod === "custom" && (
                    <div className="mt-4">
                      <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Format</CardTitle>
                  <CardDescription>Select the format for the report</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select defaultValue={reportFormat} onValueChange={handleFormatChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chart">Charts & Graphs</SelectItem>
                      <SelectItem value="table">Tabular Data</SelectItem>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="detailed">Detailed Report</SelectItem>
                      <SelectItem value="dashboard">Interactive Dashboard</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                  <CardDescription>Configure how the report will be exported</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={exportFormat === "pdf" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setExportFormat("pdf")}
                      >
                        <FilePdf className="mr-2 h-4 w-4" />
                        PDF
                      </Button>
                      <Button
                        variant={exportFormat === "excel" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setExportFormat("excel")}
                      >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Excel
                      </Button>
                      <Button
                        variant={exportFormat === "csv" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setExportFormat("csv")}
                      >
                        <FileTextIcon className="mr-2 h-4 w-4" />
                        CSV
                      </Button>
                      <Button
                        variant={exportFormat === "image" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setExportFormat("image")}
                      >
                        <FileTextIcon className="mr-2 h-4 w-4" />
                        Image
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="compareWithPrevious"
                      checked={compareWithPrevious}
                      onCheckedChange={(checked) => setCompareWithPrevious(checked as boolean)}
                    />
                    <Label htmlFor="compareWithPrevious">Compare with previous period</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showRawData"
                      checked={showRawData}
                      onCheckedChange={(checked) => setShowRawData(checked as boolean)}
                    />
                    <Label htmlFor="showRawData">Include raw data tables</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Report Actions</CardTitle>
                  <CardDescription>Generate, save, or schedule your report</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" onClick={handleExportReports} disabled={isGeneratingReport}>
                    {isGeneratingReport ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Report
                      </>
                    )}
                  </Button>

                  <Button variant="outline" className="w-full" onClick={handleSaveReport}>
                    <Star className="mr-2 h-4 w-4" />
                    Save Report Configuration
                  </Button>

                  <Button variant="outline" className="w-full" onClick={handleScheduleReport}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Recurring Report
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="patient">
              <TabsList>
                <TabsTrigger value="patient">Patient Statistics</TabsTrigger>
                <TabsTrigger value="financial">Financial Reports</TabsTrigger>
                <TabsTrigger value="department">Department Analysis</TabsTrigger>
                <TabsTrigger value="inventory">Inventory Status</TabsTrigger>
              </TabsList>
              <TabsContent value="patient" className="border-none p-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Visits (Monthly)</CardTitle>
                    <CardDescription>Number of patient visits per month</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={patientData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="patients" fill="#8884d8" name="Total Patients" />
                        <Bar dataKey="outpatient" fill="#82ca9d" name="Outpatient" />
                        <Bar dataKey="inpatient" fill="#ffc658" name="Inpatient" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDownloadReport("Patient Statistics")}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="financial" className="border-none p-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Revenue</CardTitle>
                    <CardDescription>Revenue generated per month</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={revenueData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, ""]} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                        <Line type="monotone" dataKey="expenses" stroke="#82ca9d" name="Expenses" />
                        <Line type="monotone" dataKey="profit" stroke="#ffc658" name="Profit" />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDownloadReport("Financial Report")}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="department" className="border-none p-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Distribution by Department</CardTitle>
                    <CardDescription>Percentage of patients by department</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDownloadReport("Department Analysis")}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="inventory" className="border-none p-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Status</CardTitle>
                    <CardDescription>Current inventory levels and usage</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={inventoryData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="stock" fill="#8884d8" name="Current Stock %" />
                        <Bar dataKey="usage" fill="#82ca9d" name="Monthly Usage %" />
                        <Bar dataKey="reorder" fill="#ffc658" name="Reorder Point %" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDownloadReport("Inventory Status")}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Saved Reports Tab */}
          <TabsContent value="saved" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Saved Reports</h2>
              <div className="relative w-64">
                <Input
                  placeholder="Search saved reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedReports.length > 0 ? (
                savedReports
                  .filter(
                    (report) =>
                      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      report.type.toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                  .map((report) => (
                    <Card key={report.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="mb-1">
                            {getIconForReportType(report.type)}
                            <span className="ml-1 capitalize">{report.type}</span>
                          </Badge>
                          <Badge variant="outline">
                            {getIconForReportFormat(report.format)}
                            <span className="ml-1 capitalize">{report.format}</span>
                          </Badge>
                        </div>
                        <CardTitle className="text-base">{report.name}</CardTitle>
                        <CardDescription>Last run: {report.lastRun}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between pt-2">
                        <Button variant="outline" size="sm" onClick={() => handleRunSavedReport(report)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Run Report
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteSavedReport(report.id)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No saved reports</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Generate and save a report to see it here.</p>
                  <Button className="mt-4" onClick={() => setActiveTab("reports")}>
                    Create a Report
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Scheduled Reports Tab */}
          <TabsContent value="scheduled" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Scheduled Reports</h2>
              <Button onClick={handleScheduleReport}>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule New Report
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Monthly Financial Summary</TableCell>
                    <TableCell>Monthly</TableCell>
                    <TableCell>Aug 1, 2023</TableCell>
                    <TableCell>admin@hospital.com</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Pause
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Weekly Patient Statistics</TableCell>
                    <TableCell>Weekly</TableCell>
                    <TableCell>Jul 24, 2023</TableCell>
                    <TableCell>department@hospital.com</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Pause
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Quarterly Performance Review</TableCell>
                    <TableCell>Quarterly</TableCell>
                    <TableCell>Oct 1, 2023</TableCell>
                    <TableCell>management@hospital.com</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Pause
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Generated Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{generatedReport?.title}</DialogTitle>
            <DialogDescription>
              {generatedReport?.description} - Generated on {generatedReport?.date}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border p-4 mb-4">
              <h3 className="text-lg font-semibold mb-2">Report Summary</h3>
              <p className="text-sm text-gray-500 mb-4">
                This report provides an overview of {reportType} data for the selected {timePeriod} period.
              </p>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Report Type:</span>
                  <span className="text-sm">{reportType.charAt(0).toUpperCase() + reportType.slice(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Time Period:</span>
                  <span className="text-sm">{timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Format:</span>
                  <span className="text-sm">{reportFormat.charAt(0).toUpperCase() + reportFormat.slice(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Generated By:</span>
                  <span className="text-sm">Admin User</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Generation Date:</span>
                  <span className="text-sm">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <p className="text-sm">
                Your report has been generated successfully. You can now download, print, or share this report.
              </p>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handlePrintReport}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" onClick={handleShareReport}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            <Button onClick={() => handleDownloadReport(generatedReport?.title || "Report")}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Report Filters</DialogTitle>
            <DialogDescription>Customize your report by applying filters</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
            </div>

            <div className="space-y-2">
              <Label>Departments</Label>
              <div className="grid grid-cols-2 gap-2">
                {["All", "General Medicine", "Cardiology", "Pediatrics", "Orthopedics", "Neurology"].map((dept) => (
                  <div className="flex items-center space-x-2" key={dept}>
                    <Checkbox
                      id={`dept-${dept}`}
                      checked={selectedDepartments.includes(dept)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedDepartments([...selectedDepartments, dept])
                        } else {
                          setSelectedDepartments(selectedDepartments.filter((d) => d !== dept))
                        }
                      }}
                    />
                    <Label htmlFor={`dept-${dept}`}>{dept}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional Options</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="compareWithPrevious">Compare with previous period</Label>
                  <Switch
                    id="compareWithPrevious"
                    checked={compareWithPrevious}
                    onCheckedChange={setCompareWithPrevious}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showRawData">Include raw data tables</Label>
                  <Switch id="showRawData" checked={showRawData} onCheckedChange={setShowRawData} />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFilterDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Report</DialogTitle>
            <DialogDescription>Set up automatic generation and delivery of this report</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reportName">Report Name</Label>
              <Input id="reportName" placeholder="Enter a name for this scheduled report" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select defaultValue="weekly">
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients (Email)</Label>
              <Input id="recipients" placeholder="Enter email addresses separated by commas" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exportFormat">Export Format</Label>
              <Select defaultValue="pdf">
                <SelectTrigger id="exportFormat">
                  <SelectValue placeholder="Select export format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSchedule}>Schedule Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { Search, Trash } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
