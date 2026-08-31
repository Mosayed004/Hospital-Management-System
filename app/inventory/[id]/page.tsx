"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, Edit, Trash, AlertTriangle, Save, LogOut } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AuthGuard from "@/components/auth-guard"

export default function InventoryItemPage() {
  return (
    <AuthGuard allowedRoles={["admin", "pharmacist", "inventory_manager"]}>
      <InventoryItemDetails />
    </AuthGuard>
  )
}

function InventoryItemDetails() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedItem, setEditedItem] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Get the item ID from the URL
  const itemId = params.id as string

  useEffect(() => {
    // Load inventory from localStorage
    const storedInventory = localStorage.getItem("hms_inventory")
    if (storedInventory) {
      try {
        const inventory = JSON.parse(storedInventory)
        const foundItem = inventory.find((i: any) => i.id === itemId)

        if (foundItem) {
          setItem(foundItem)
          setEditedItem(foundItem)
        } else {
          toast({
            title: "Item Not Found",
            description: `No inventory item found with ID ${itemId}`,
            variant: "destructive",
          })
          // Redirect back to inventory page after a short delay
          setTimeout(() => router.push("/inventory"), 2000)
        }
      } catch (error) {
        console.error("Error parsing stored inventory:", error)
        toast({
          title: "Error",
          description: "Failed to load inventory data",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "No Inventory Data",
        description: "No inventory data found in storage",
        variant: "destructive",
      })
    }

    setLoading(false)
  }, [itemId, router, toast])

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
    setEditedItem((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSaveChanges = () => {
    // Load current inventory
    const storedInventory = localStorage.getItem("hms_inventory")
    if (storedInventory) {
      try {
        const inventory = JSON.parse(storedInventory)

        // Find the index of the item to update
        const itemIndex = inventory.findIndex((i: any) => i.id === itemId)

        if (itemIndex !== -1) {
          // Update the item
          inventory[itemIndex] = {
            ...editedItem,
            // Convert string values to numbers where needed
            quantity: Number(editedItem.quantity),
            price: Number(editedItem.price),
            reorderLevel: Number(editedItem.reorderLevel),
            // Update status based on quantity and reorder level
            status: Number(editedItem.quantity) <= Number(editedItem.reorderLevel) ? "Low Stock" : "In Stock",
          }

          // Save updated inventory back to localStorage
          localStorage.setItem("hms_inventory", JSON.stringify(inventory))

          // Update local state
          setItem(inventory[itemIndex])

          toast({
            title: "Changes Saved",
            description: `${editedItem.name} has been updated successfully`,
          })

          // Exit edit mode
          setIsEditing(false)
        }
      } catch (error) {
        console.error("Error updating inventory:", error)
        toast({
          title: "Error",
          description: "Failed to save changes",
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteItem = () => {
    // Load current inventory
    const storedInventory = localStorage.getItem("hms_inventory")
    if (storedInventory) {
      try {
        const inventory = JSON.parse(storedInventory)

        // Filter out the item to delete
        const updatedInventory = inventory.filter((i: any) => i.id !== itemId)

        // Save updated inventory back to localStorage
        localStorage.setItem("hms_inventory", JSON.stringify(updatedInventory))

        toast({
          title: "Item Deleted",
          description: `${item.name} has been removed from inventory`,
        })

        // Close the dialog and redirect back to inventory page
        setIsDeleteDialogOpen(false)
        router.push("/inventory")
      } catch (error) {
        console.error("Error deleting inventory item:", error)
        toast({
          title: "Error",
          description: "Failed to delete item",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <div className="animate-pulse text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading Item Details...</h2>
          <p className="text-muted-foreground">Please wait while we fetch the inventory item</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Item Not Found</h2>
          <p className="text-muted-foreground mb-4">The inventory item you're looking for doesn't exist</p>
          <Button asChild>
            <Link href="/inventory">Return to Inventory</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 shadow-subtle">
        <Link href="/inventory" className="flex items-center gap-2 font-semibold">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Inventory</span>
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Inventory Item Details</h1>
            <Badge
              variant={item.status === "In Stock" ? "outline" : "secondary"}
              className={item.status === "Low Stock" ? "bg-amber-100 text-amber-800 border-amber-200" : ""}
            >
              {item.status}
            </Badge>
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
                  Edit Item
                </Button>
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete {item.name}? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteItem}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about this inventory item</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">Item ID</Label>
                {isEditing ? (
                  <Input id="id" value={editedItem.id} disabled />
                ) : (
                  <div className="rounded-md border px-3 py-2 text-sm">{item.id}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                {isEditing ? (
                  <Input id="name" name="name" value={editedItem.name} onChange={handleInputChange} />
                ) : (
                  <div className="rounded-md border px-3 py-2 text-sm">{item.name}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                {isEditing ? (
                  <Input id="category" name="category" value={editedItem.category} onChange={handleInputChange} />
                ) : (
                  <div className="rounded-md border px-3 py-2 text-sm">{item.category}</div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  {isEditing ? (
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={editedItem.quantity}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="rounded-md border px-3 py-2 text-sm">{item.quantity}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  {isEditing ? (
                    <Input id="unit" name="unit" value={editedItem.unit} onChange={handleInputChange} />
                  ) : (
                    <div className="rounded-md border px-3 py-2 text-sm">{item.unit}</div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reorderLevel">Reorder Level</Label>
                {isEditing ? (
                  <Input
                    id="reorderLevel"
                    name="reorderLevel"
                    type="number"
                    value={editedItem.reorderLevel}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="rounded-md border px-3 py-2 text-sm">{item.reorderLevel}</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>More information about this inventory item</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (per unit)</Label>
                {isEditing ? (
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={editedItem.price}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="rounded-md border px-3 py-2 text-sm">${item.price.toFixed(2)}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                {isEditing ? (
                  <Input id="supplier" name="supplier" value={editedItem.supplier} onChange={handleInputChange} />
                ) : (
                  <div className="rounded-md border px-3 py-2 text-sm">{item.supplier}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                {isEditing ? (
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    value={editedItem.expiryDate}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="rounded-md border px-3 py-2 text-sm">{item.expiryDate}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Storage Location</Label>
                {isEditing ? (
                  <Input id="location" name="location" value={editedItem.location} onChange={handleInputChange} />
                ) : (
                  <div className="rounded-md border px-3 py-2 text-sm">{item.location}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                {isEditing ? (
                  <Textarea
                    id="description"
                    name="description"
                    value={editedItem.description || ""}
                    onChange={handleInputChange}
                    rows={3}
                  />
                ) : (
                  <div className="rounded-md border px-3 py-2 text-sm min-h-[80px]">
                    {item.description || "No description provided"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Inventory History</CardTitle>
            <CardDescription>Recent activity for this inventory item</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Item Added to Inventory</p>
                  <p className="text-sm text-muted-foreground">
                    Initial quantity: {item.quantity} {item.unit}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">May 8, 2025</p>
              </div>
              {/* This would be populated with actual history data in a real application */}
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">No additional history available</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                toast({ title: "Coming Soon", description: "Full history view will be available in a future update" })
              }
            >
              View Full History
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
