"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Plus, AlertTriangle, LogOut } from "lucide-react"
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

export default function PharmacyPage() {
  return (
    <AuthGuard allowedRoles={["pharmacy", "admin"]}>
      <PharmacyManagement />
    </AuthGuard>
  )
}

function PharmacyManagement() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddInventoryDialogOpen, setIsAddInventoryDialogOpen] = useState(false)
  const [newMedication, setNewMedication] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "tablets",
    expiryDate: "",
    batchNumber: "",
    supplier: "",
  })

  // Sample medications data
  const [medications, setMedications] = useState([
    {
      id: "MED-0112",
      name: "Amoxicillin 500mg",
      category: "Antibiotics",
      quantity: "124 capsules",
      expiryDate: "12/15/2025",
      status: "In Stock",
    },
    {
      id: "MED-0113",
      name: "Lisinopril 10mg",
      category: "Antihypertensive",
      quantity: "45 tablets",
      expiryDate: "08/30/2025",
      status: "Low Stock",
    },
    {
      id: "MED-0114",
      name: "Prednisone 20mg",
      category: "Corticosteroids",
      quantity: "78 tablets",
      expiryDate: "10/15/2025",
      status: "In Stock",
    },
    {
      id: "MED-0115",
      name: "Insulin Glargine",
      category: "Diabetes",
      quantity: "12 vials",
      expiryDate: "06/10/2025",
      status: "Critical Low",
    },
  ])

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
      description: "Medication list has been filtered based on your criteria",
    })
  }

  const handleViewMedication = (medicationId: string) => {
    // Find the medication by ID
    const medication = medications.find((m) => m.id === medicationId)

    if (medication) {
      toast({
        title: "Medication Details",
        description: `Viewing details for ${medication.name} (ID: ${medicationId})`,
      })

      // Navigate to the medication detail page
      router.push(`/pharmacy/${medicationId}`)
    }
  }

  const handleLowStockItems = () => {
    toast({
      title: "Low Stock Items",
      description: "Displaying all medications with low stock levels",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewMedication((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewMedication((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddInventory = () => {
    // Generate a new medication ID
    const newId = `MED-${Math.floor(1000 + Math.random() * 9000)}`

    // Determine status based on quantity
    let status = "In Stock"
    const quantityNum = Number.parseInt(newMedication.quantity, 10)
    if (quantityNum <= 20) status = "Low Stock"
    if (quantityNum <= 10) status = "Critical Low"

    // Create new medication object
    const medication = {
      id: newId,
      name: newMedication.name,
      category: newMedication.category,
      quantity: `${newMedication.quantity} ${newMedication.unit}`,
      expiryDate: newMedication.expiryDate,
      status: status,
    }

    // Add to medications array
    setMedications([medication, ...medications])

    // Show success message
    toast({
      title: "Inventory Added",
      description: `${medication.name} has been added to inventory with ID ${medication.id}`,
    })

    // Reset form and close dialog
    setNewMedication({
      name: "",
      category: "",
      quantity: "",
      unit: "tablets",
      expiryDate: "",
      batchNumber: "",
      supplier: "",
    })
    setIsAddInventoryDialogOpen(false)
  }

  // Filter medications based on search query
  const filteredMedications = medications.filter(
    (medication) =>
      medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medication.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medication.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="relative h-8 w-8 mr-2">
            <Image src="/images/logo.png" alt="Helwan National University Hospital" fill className="object-contain" />
          </div>
          <span>Helwan National University Hospital</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm">
            Help
          </Button>
          <Button size="sm">Pharmacist</Button>
          <Button size="sm" variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pharmacy & Inventory</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleLowStockItems}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Low Stock Items
            </Button>
            <Dialog open={isAddInventoryDialogOpen} onOpenChange={setIsAddInventoryDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Inventory
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add Medication to Inventory</DialogTitle>
                  <DialogDescription>Enter the medication details below to add it to the inventory.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Medication Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newMedication.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Amoxicillin 500mg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newMedication.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                        <SelectItem value="Antihypertensive">Antihypertensive</SelectItem>
                        <SelectItem value="Analgesics">Analgesics</SelectItem>
                        <SelectItem value="Corticosteroids">Corticosteroids</SelectItem>
                        <SelectItem value="Diabetes">Diabetes</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        value={newMedication.quantity}
                        onChange={handleInputChange}
                        placeholder="e.g., 100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select value={newMedication.unit} onValueChange={(value) => handleSelectChange("unit", value)}>
                        <SelectTrigger id="unit">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tablets">Tablets</SelectItem>
                          <SelectItem value="capsules">Capsules</SelectItem>
                          <SelectItem value="vials">Vials</SelectItem>
                          <SelectItem value="bottles">Bottles</SelectItem>
                          <SelectItem value="boxes">Boxes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        type="date"
                        value={newMedication.expiryDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="batchNumber">Batch Number</Label>
                      <Input
                        id="batchNumber"
                        name="batchNumber"
                        value={newMedication.batchNumber}
                        onChange={handleInputChange}
                        placeholder="e.g., BN12345"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input
                      id="supplier"
                      name="supplier"
                      value={newMedication.supplier}
                      onChange={handleInputChange}
                      placeholder="e.g., MedSupply Inc."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddInventoryDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddInventory}>Add to Inventory</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground">42 categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prescriptions Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">5 pending fulfillment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 critical</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Within 30 days</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search medications..."
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
            <Tabs defaultValue="inventory">
              <TabsList>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>
              <TabsContent value="inventory" className="border-none p-0 pt-4">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medication ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Expiry Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMedications.map((medication) => (
                          <TableRow key={medication.id}>
                            <TableCell>{medication.id}</TableCell>
                            <TableCell>{medication.name}</TableCell>
                            <TableCell>{medication.category}</TableCell>
                            <TableCell>{medication.quantity}</TableCell>
                            <TableCell>{medication.expiryDate}</TableCell>
                            <TableCell>
                              <span
                                className={`text-xs font-medium rounded-full px-2 py-1 ${
                                  medication.status === "In Stock"
                                    ? "text-green-500 bg-green-50"
                                    : medication.status === "Low Stock"
                                      ? "text-yellow-500 bg-yellow-50"
                                      : "text-red-500 bg-red-50"
                                }`}
                              >
                                {medication.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleViewMedication(medication.id)}>
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
                      Showing {filteredMedications.length} of {medications.length} medications
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
              <TabsContent value="prescriptions" className="border-none p-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Prescriptions</CardTitle>
                    <CardDescription>Prescriptions waiting to be fulfilled</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">There are 5 prescriptions pending fulfillment.</p>
                    <div className="mt-4 space-y-4">
                      <div className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Amoxicillin 500mg</div>
                          <div className="text-xs font-medium text-yellow-500 bg-yellow-50 rounded-full px-2 py-1">
                            Pending
                          </div>
                        </div>
                        <div className="mt-2 text-sm">John Doe (P-2023-0584)</div>
                        <div className="text-xs text-muted-foreground">1 capsule 3 times daily for 7 days</div>
                        <div className="mt-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Prescription Fulfilled",
                                description: "Prescription for John Doe has been marked as fulfilled",
                              })
                              // In a real app, this would update the prescription status
                            }}
                          >
                            Fulfill Prescription
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        toast({
                          title: "View All Prescriptions",
                          description: "Loading all pending prescriptions",
                        })
                        // In a real app, this would load all prescriptions
                      }}
                    >
                      View All Prescriptions
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="orders" className="border-none p-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Medication orders placed in the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">There are 12 orders in the last 30 days.</p>
                    <div className="mt-4">
                      <Button
                        onClick={() =>
                          toast({
                            title: "New Order",
                            description: "Creating a new medication order",
                          })
                        }
                      >
                        Place New Order
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        toast({
                          title: "View All Orders",
                          description: "Loading all medication orders",
                        })
                      }
                    >
                      View All Orders
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
