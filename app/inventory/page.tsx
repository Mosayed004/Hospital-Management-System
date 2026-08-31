"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Package, Search, Filter, Plus, LogOut, AlertTriangle, CheckCircle, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import AuthGuard from "@/components/auth-guard"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function InventoryPage() {
  return (
    <AuthGuard allowedRoles={["admin", "pharmacist", "inventory_manager"]}>
      <InventoryManagement />
    </AuthGuard>
  )
}

function InventoryManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    price: "",
    supplier: "",
    expiryDate: "",
    location: "",
    description: "",
  })

  // Sample inventory data
  const [inventory, setInventory] = useState([
    {
      id: "INV-001",
      name: "Paracetamol 500mg",
      category: "Medication",
      quantity: 250,
      unit: "Tablets",
      price: 0.15,
      supplier: "Pharma Inc.",
      expiryDate: "2024-12-31",
      location: "Pharmacy Store A",
      status: "In Stock",
      reorderLevel: 50,
    },
    {
      id: "INV-002",
      name: "Surgical Gloves (Medium)",
      category: "Medical Supplies",
      quantity: 35,
      unit: "Boxes",
      price: 8.5,
      supplier: "MedSupply Co.",
      expiryDate: "2025-06-30",
      location: "Surgery Department",
      status: "Low Stock",
      reorderLevel: 40,
    },
    {
      id: "INV-003",
      name: "Insulin Syringes",
      category: "Medical Supplies",
      quantity: 150,
      unit: "Pieces",
      price: 0.75,
      supplier: "MedSupply Co.",
      expiryDate: "2025-03-15",
      location: "Pharmacy Store B",
      status: "In Stock",
      reorderLevel: 50,
    },
    {
      id: "INV-004",
      name: "Amoxicillin 250mg",
      category: "Medication",
      quantity: 120,
      unit: "Capsules",
      price: 0.25,
      supplier: "Pharma Inc.",
      expiryDate: "2024-08-20",
      location: "Pharmacy Store A",
      status: "In Stock",
      reorderLevel: 40,
    },
    {
      id: "INV-005",
      name: "Disposable Face Masks",
      category: "Medical Supplies",
      quantity: 15,
      unit: "Boxes",
      price: 12.0,
      supplier: "MedSupply Co.",
      expiryDate: "2026-01-15",
      location: "General Storage",
      status: "Low Stock",
      reorderLevel: 20,
    },
  ])

  // Load inventory from localStorage on component mount
  useEffect(() => {
    const storedInventory = localStorage.getItem("hms_inventory")
    if (storedInventory) {
      try {
        const parsedInventory = JSON.parse(storedInventory)
        console.log("Loaded inventory from localStorage:", parsedInventory)
        setInventory(parsedInventory)
      } catch (error) {
        console.error("Error parsing stored inventory:", error)
      }
    }
  }, [])

  // Save inventory to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("hms_inventory", JSON.stringify(inventory))
  }, [inventory])

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
      description: "Inventory has been filtered based on your criteria",
    })
  }

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Inventory data is being downloaded as CSV",
    })
  }

  const handleViewItem = (itemId: string) => {
    // Find the item by ID
    const item = inventory.find((i) => i.id === itemId)

    if (item) {
      toast({
        title: "Item Details",
        description: `Viewing details for ${item.name}`,
      })

      // In a real app, this would navigate to an item detail page
      // router.push(`/inventory/${itemId}`)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewItem((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewItem((prev) => ({ ...prev, [name]: value }))
  }

  const openAddItemDialog = () => {
    // Reset the form fields to ensure a clean state
    setNewItem({
      name: "",
      category: "",
      quantity: "",
      unit: "",
      price: "",
      supplier: "",
      expiryDate: "",
      location: "",
      description: "",
    })
    // Open the dialog
    setIsAddItemDialogOpen(true)
  }

  const handleAddItem = () => {
    // Validate required fields
    if (!newItem.name || !newItem.category || !newItem.quantity || !newItem.unit) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Category, Quantity, Unit)",
        variant: "destructive",
      })
      return
    }

    // Generate a new item ID
    const newId = `INV-${String(inventory.length + 1).padStart(3, "0")}`

    // Determine status based on quantity and a default reorder level
    const quantity = Number.parseInt(newItem.quantity)
    const reorderLevel = Math.max(Math.floor(quantity * 0.2), 10) // 20% of quantity or minimum 10
    const status = quantity <= reorderLevel ? "Low Stock" : "In Stock"

    // Create new item object
    const item = {
      id: newId,
      name: newItem.name,
      category: newItem.category,
      quantity: quantity,
      unit: newItem.unit,
      price: Number.parseFloat(newItem.price) || 0,
      supplier: newItem.supplier || "Not specified",
      expiryDate: newItem.expiryDate || "Not applicable",
      location: newItem.location || "General Storage",
      status: status,
      reorderLevel: reorderLevel,
    }

    // Add to inventory array
    const updatedInventory = [...inventory, item]
    setInventory(updatedInventory)

    // Save to localStorage
    localStorage.setItem("hms_inventory", JSON.stringify(updatedInventory))

    // Show success message
    toast({
      title: "Item Added",
      description: `${item.name} has been added to inventory with ID ${item.id}`,
    })

    // Reset form and close dialog
    setNewItem({
      name: "",
      category: "",
      quantity: "",
      unit: "",
      price: "",
      supplier: "",
      expiryDate: "",
      location: "",
      description: "",
    })
    setIsAddItemDialogOpen(false)

    // Log for debugging
    console.log("Item added:", item)
    console.log("Updated inventory:", updatedInventory)
  }

  // Filter inventory based on search query
  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get low stock items
  const lowStockItems = inventory.filter((item) => {
    // Ensure we're comparing numbers
    return item.quantity <= item.reorderLevel
  })

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 shadow-subtle">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="relative h-8 w-8 mr-2">
            <Image src="/images/logo.png" alt="Helwan National University Hospital" fill className="object-contain" />
          </div>
          <span className="text-primary">Helwan National University Hospital</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm">
            Help
          </Button>
          <Button size="sm">Staff</Button>
          <Button size="sm" variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Inventory & Pharmacy Management</h1>
          <Button onClick={openAddItemDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Item
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventory.length}</div>
              <p className="text-xs text-muted-foreground">Items in inventory</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockItems.length}</div>
              <p className="text-xs text-muted-foreground">Items below reorder level</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medications</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inventory.filter((item) => item.category === "Medication").length}
              </div>
              <p className="text-xs text-muted-foreground">Medication items</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medical Supplies</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inventory.filter((item) => item.category === "Medical Supplies").length}
              </div>
              <p className="text-xs text-muted-foreground">Medical supply items</p>
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
                  placeholder="Search inventory..."
                  className="w-full bg-background pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
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
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="supplies">Medical Supplies</TabsTrigger>
                <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="border-none p-0 pt-4">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInventory.length > 0 ? (
                          filteredInventory.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.unit}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={item.status === "In Stock" ? "outline" : "secondary"}
                                  className={
                                    item.status === "Low Stock" ? "bg-amber-100 text-amber-800 border-amber-200" : ""
                                  }
                                >
                                  {item.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => handleViewItem(item.id)}>
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                              No items found. Please add a new item to inventory.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t p-4">
                    <div className="text-xs text-muted-foreground">
                      Showing {filteredInventory.length} of {inventory.length} items
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={filteredInventory.length === 0}
                        onClick={() => {
                          toast({
                            title: "Previous Page",
                            description: "Loading previous page of results",
                          })
                        }}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={filteredInventory.length === 0}
                        onClick={() => {
                          toast({
                            title: "Next Page",
                            description: "Loading next page of results",
                          })
                        }}
                      >
                        Next
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="medications" className="border-none p-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Medications</CardTitle>
                    <CardDescription>All pharmaceutical products in inventory</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Expiry Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inventory
                          .filter((item) => item.category === "Medication")
                          .map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>
                                {item.quantity} {item.unit}
                              </TableCell>
                              <TableCell>{item.expiryDate}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={item.status === "In Stock" ? "outline" : "secondary"}
                                  className={
                                    item.status === "Low Stock" ? "bg-amber-100 text-amber-800 border-amber-200" : ""
                                  }
                                >
                                  {item.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => handleViewItem(item.id)}>
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="supplies" className="border-none p-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Supplies</CardTitle>
                    <CardDescription>All medical supplies and equipment in inventory</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inventory
                          .filter((item) => item.category === "Medical Supplies")
                          .map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>
                                {item.quantity} {item.unit}
                              </TableCell>
                              <TableCell>{item.location}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={item.status === "In Stock" ? "outline" : "secondary"}
                                  className={
                                    item.status === "Low Stock" ? "bg-amber-100 text-amber-800 border-amber-200" : ""
                                  }
                                >
                                  {item.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => handleViewItem(item.id)}>
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="low-stock" className="border-none p-0 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Low Stock Items</CardTitle>
                    <CardDescription>Items that need to be reordered soon</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {lowStockItems.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Reorder Level</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {lowStockItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>
                                <span className="text-amber-600 font-medium">{item.quantity}</span> {item.unit}
                              </TableCell>
                              <TableCell>
                                {item.reorderLevel} {item.unit}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    toast({
                                      title: "Order Placed",
                                      description: `Reorder request for ${item.name} has been submitted`,
                                    })
                                  }}
                                >
                                  Reorder
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                        <h3 className="text-lg font-medium mb-1">All Items In Stock</h3>
                        <p className="text-muted-foreground">There are no items below reorder level.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Add Item Dialog */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
            <DialogDescription>Enter the item details below to add it to the inventory.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Item Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                placeholder="e.g., Paracetamol 500mg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={newItem.category}
                onValueChange={(value) => handleSelectChange("category", value)}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Medication">Medication</SelectItem>
                  <SelectItem value="Medical Supplies">Medical Supplies</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Laboratory">Laboratory</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Quantity <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">
                  Unit <span className="text-destructive">*</span>
                </Label>
                <Select value={newItem.unit} onValueChange={(value) => handleSelectChange("unit", value)} required>
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tablets">Tablets</SelectItem>
                    <SelectItem value="Capsules">Capsules</SelectItem>
                    <SelectItem value="Bottles">Bottles</SelectItem>
                    <SelectItem value="Boxes">Boxes</SelectItem>
                    <SelectItem value="Pieces">Pieces</SelectItem>
                    <SelectItem value="Vials">Vials</SelectItem>
                    <SelectItem value="Ampoules">Ampoules</SelectItem>
                    <SelectItem value="Packs">Packs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (per unit)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 10.50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={newItem.expiryDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                name="supplier"
                value={newItem.supplier}
                onChange={handleInputChange}
                placeholder="e.g., Pharma Inc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Storage Location</Label>
              <Input
                id="location"
                name="location"
                value={newItem.location}
                onChange={handleInputChange}
                placeholder="e.g., Pharmacy Store A"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newItem.description}
                onChange={handleInputChange}
                placeholder="Additional details about the item"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
