"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Edit, Printer, Download, CreditCard, CheckCircle, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Invoice {
  id: string
  patientName: string
  patientId: string
  invoiceNumber: string
  date: string
  dueDate: string
  status: string
  totalAmount: number
  paidAmount: number
  balanceAmount: number
  paymentMethod?: string
  paymentDate?: string
  items: {
    id: string
    description: string
    quantity: number
    unitPrice: number
    amount: number
    category: string
  }[]
  insuranceDetails?: {
    provider: string
    policyNumber: string
    coveragePercentage: number
    approvalCode?: string
    claimStatus?: string
    claimAmount?: number
  }
  notes?: string
  paymentHistory: {
    id: string
    date: string
    amount: number
    method: string
    reference: string
    processedBy: string
  }[]
}

export default function InvoiceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real application, this would be an API call
    // For now, we'll simulate fetching from localStorage
    const fetchInvoice = () => {
      setLoading(true)
      try {
        const storedInvoices = localStorage.getItem("invoices")
        if (storedInvoices) {
          const invoices = JSON.parse(storedInvoices)
          const foundInvoice = invoices.find((i: Invoice) => i.id === params.id)

          if (foundInvoice) {
            // Simulate a delay to show loading state
            setTimeout(() => {
              setInvoice(foundInvoice)
              setLoading(false)
            }, 500)
          } else {
            toast({
              title: "Invoice not found",
              description: "The requested invoice could not be found.",
              variant: "destructive",
            })
            router.push("/billing")
          }
        } else {
          // If no invoices in storage, use mock data
          const mockInvoice: Invoice = {
            id: params.id as string,
            patientName: "John Doe",
            patientId: "P12345",
            invoiceNumber: "INV-2023-0042",
            date: "2023-05-15",
            dueDate: "2023-06-15",
            status: "Partially Paid",
            totalAmount: 1250.0,
            paidAmount: 750.0,
            balanceAmount: 500.0,
            items: [
              {
                id: "item-001",
                description: "Consultation - Dr. Smith",
                quantity: 1,
                unitPrice: 200.0,
                amount: 200.0,
                category: "Consultation",
              },
              {
                id: "item-002",
                description: "Complete Blood Count",
                quantity: 1,
                unitPrice: 150.0,
                amount: 150.0,
                category: "Laboratory",
              },
              {
                id: "item-003",
                description: "X-Ray - Chest",
                quantity: 1,
                unitPrice: 300.0,
                amount: 300.0,
                category: "Radiology",
              },
              {
                id: "item-004",
                description: "Medication - Amoxicillin 500mg",
                quantity: 20,
                unitPrice: 5.0,
                amount: 100.0,
                category: "Pharmacy",
              },
              {
                id: "item-005",
                description: "Room Charges - General Ward (2 days)",
                quantity: 2,
                unitPrice: 250.0,
                amount: 500.0,
                category: "Accommodation",
              },
            ],
            insuranceDetails: {
              provider: "HealthPlus Insurance",
              policyNumber: "HP-12345678",
              coveragePercentage: 70,
              approvalCode: "AP-987654",
              claimStatus: "Approved",
              claimAmount: 875.0,
            },
            notes: "Patient was admitted for pneumonia treatment. Insurance claim has been processed.",
            paymentHistory: [
              {
                id: "payment-001",
                date: "2023-05-20",
                amount: 500.0,
                method: "Credit Card",
                reference: "CC-98765",
                processedBy: "Jane Cashier",
              },
              {
                id: "payment-002",
                date: "2023-05-30",
                amount: 250.0,
                method: "Bank Transfer",
                reference: "BT-12345",
                processedBy: "John Accountant",
              },
            ],
          }

          setTimeout(() => {
            setInvoice(mockInvoice)
            setLoading(false)
          }, 500)
        }
      } catch (error) {
        console.error("Error fetching invoice:", error)
        toast({
          title: "Error",
          description: "Failed to load invoice data. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchInvoice()
  }, [params.id, router, toast])

  const handleEditInvoice = () => {
    toast({
      title: "Edit Invoice",
      description: `Editing invoice: ${invoice?.invoiceNumber}`,
    })
    // In a real app, this would navigate to an edit form or open a modal
  }

  const handleBackToList = () => {
    router.push("/billing")
  }

  const handlePrintInvoice = () => {
    toast({
      title: "Print Invoice",
      description: `Printing invoice: ${invoice?.invoiceNumber}`,
    })
    // In a real app, this would open a print dialog
  }

  const handleDownloadInvoice = () => {
    toast({
      title: "Download Invoice",
      description: `Downloading invoice: ${invoice?.invoiceNumber} as PDF`,
    })
    // In a real app, this would download a PDF
  }

  const handleRecordPayment = () => {
    toast({
      title: "Record Payment",
      description: `Recording payment for invoice: ${invoice?.invoiceNumber}`,
    })
    // In a real app, this would open a payment form
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Billing
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Loading invoice information...</CardTitle>
            <CardDescription>Please wait while we fetch the invoice details.</CardDescription>
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

  if (!invoice) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Billing
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Invoice Not Found</CardTitle>
            <CardDescription>The requested invoice could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please return to the billing list and select a valid invoice.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleBackToList}>Return to Billing</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>
      case "Unpaid":
        return <Badge variant="destructive">Unpaid</Badge>
      case "Partially Paid":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Partially Paid</Badge>
      case "Overdue":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getClaimStatusBadge = (status?: string) => {
    if (!status) return null

    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "Pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" onClick={handleBackToList}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Billing
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrintInvoice}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button size="sm" onClick={handleEditInvoice}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">Invoice #{invoice.invoiceNumber}</CardTitle>
                <CardDescription>
                  Issue Date: {invoice.date} | Due Date: {invoice.dueDate}
                </CardDescription>
              </div>
              <div>{getStatusBadge(invoice.status)}</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Bill To:</h3>
                <div className="space-y-1">
                  <p className="font-medium">{invoice.patientName}</p>
                  <p className="text-sm">Patient ID: {invoice.patientId}</p>
                  {invoice.insuranceDetails && (
                    <div className="mt-2">
                      <p className="text-sm">Insurance: {invoice.insuranceDetails.provider}</p>
                      <p className="text-sm">Policy: {invoice.insuranceDetails.policyNumber}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Summary:</h3>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Total Amount:</span> ${invoice.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Paid Amount:</span> ${invoice.paidAmount.toFixed(2)}
                  </p>
                  <p className="text-sm font-medium">
                    <span className="font-medium">Balance Due:</span> ${invoice.balanceAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Invoice Items:</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p>{item.description}</p>
                          <p className="text-xs text-gray-500">{item.category}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <div className="w-full md:w-1/3">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal:</span>
                    <span>${invoice.totalAmount.toFixed(2)}</span>
                  </div>
                  {invoice.insuranceDetails && (
                    <div className="flex justify-between">
                      <span className="font-medium">
                        Insurance Coverage ({invoice.insuranceDetails.coveragePercentage}%):
                      </span>
                      <span>-${invoice.insuranceDetails.claimAmount?.toFixed(2) || "0.00"}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Paid Amount:</span>
                    <span>-${invoice.paidAmount.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Balance Due:</span>
                    <span>${invoice.balanceAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Notes:</h3>
                <p className="text-sm bg-gray-50 p-3 rounded-md">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {invoice.balanceAmount > 0 && (
              <Button onClick={handleRecordPayment}>
                <CreditCard className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {invoice.insuranceDetails && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Insurance Details</h3>
                <Separator className="my-2" />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Claim Status:</span>
                    {getClaimStatusBadge(invoice.insuranceDetails.claimStatus)}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Provider:</div>
                    <div className="text-sm">{invoice.insuranceDetails.provider}</div>
                    <div className="text-sm font-medium">Policy Number:</div>
                    <div className="text-sm">{invoice.insuranceDetails.policyNumber}</div>
                    <div className="text-sm font-medium">Coverage:</div>
                    <div className="text-sm">{invoice.insuranceDetails.coveragePercentage}%</div>
                    {invoice.insuranceDetails.approvalCode && (
                      <>
                        <div className="text-sm font-medium">Approval Code:</div>
                        <div className="text-sm">{invoice.insuranceDetails.approvalCode}</div>
                      </>
                    )}
                    {invoice.insuranceDetails.claimAmount && (
                      <>
                        <div className="text-sm font-medium">Claim Amount:</div>
                        <div className="text-sm">${invoice.insuranceDetails.claimAmount.toFixed(2)}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Payment History</h3>
              <Separator className="my-2" />
              <div className="space-y-4">
                {invoice.paymentHistory.length > 0 ? (
                  invoice.paymentHistory.map((payment) => (
                    <Card key={payment.id} className="border-gray-200">
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">${payment.amount.toFixed(2)}</CardTitle>
                          <Badge variant="outline">{payment.method}</Badge>
                        </div>
                        <CardDescription>
                          {payment.date} • Ref: {payment.reference}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="py-1">
                        <p className="text-sm">Processed by: {payment.processedBy}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No payment records found.</p>
                )}
              </div>
            </div>

            {invoice.balanceAmount > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Options</h3>
                <Separator className="my-2" />
                <div className="space-y-2">
                  <Button className="w-full" onClick={handleRecordPayment}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    Generate Payment Link
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
