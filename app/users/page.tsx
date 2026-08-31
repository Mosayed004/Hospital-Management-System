"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, Filter, UserPlus, Shield, LogOut, Trash2, Edit } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Define user type
interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: string
  createdAt: string
}

export default function UsersPage() {
  return (
    <AuthGuard allowedRoles={["admin", "manager"]}>
      <UserManagement />
    </AuthGuard>
  )
}

function UserManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isManageRolesDialogOpen, setIsManageRolesDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    password: "",
    confirmPassword: "",
  })
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    role: false,
    department: false,
    password: false,
    confirmPassword: false,
  })

  const [roles, setRoles] = useState([
    {
      name: "Doctor",
      permissions: {
        patients: true,
        appointments: true,
        records: true,
        prescriptions: true,
        laboratory: true,
        billing: false,
        users: false,
        settings: false,
      },
    },
    {
      name: "Nurse",
      permissions: {
        patients: true,
        appointments: true,
        records: true,
        prescriptions: false,
        laboratory: true,
        billing: false,
        users: false,
        settings: false,
      },
    },
    {
      name: "Admin",
      permissions: {
        patients: true,
        appointments: true,
        records: true,
        prescriptions: true,
        laboratory: true,
        billing: true,
        users: true,
        settings: true,
      },
    },
    {
      name: "Billing Staff",
      permissions: {
        patients: true,
        appointments: true,
        records: false,
        prescriptions: false,
        laboratory: false,
        billing: true,
        users: false,
        settings: false,
      },
    },
    {
      name: "Lab Technician",
      permissions: {
        patients: true,
        appointments: false,
        records: false,
        prescriptions: false,
        laboratory: true,
        billing: false,
        users: false,
        settings: false,
      },
    },
  ])

  const [selectedRole, setSelectedRole] = useState(roles[0])
  const [editingPermissions, setEditingPermissions] = useState<{ [key: string]: boolean }>({})

  // Load users from localStorage on component mount
  useEffect(() => {
    const loadUsers = () => {
      try {
        const storedUsers = localStorage.getItem("hms_users")
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers))
        } else {
          // Initialize with sample data if no users exist
          const sampleUsers = [
            {
              id: "U-001",
              name: "Dr. Williams",
              email: "williams@hospital.com",
              role: "Doctor",
              department: "General Medicine",
              status: "Active",
              createdAt: new Date().toISOString().split("T")[0],
            },
            {
              id: "U-002",
              name: "Dr. Chen",
              email: "chen@hospital.com",
              role: "Doctor",
              department: "Cardiology",
              status: "Active",
              createdAt: new Date().toISOString().split("T")[0],
            },
            {
              id: "U-003",
              name: "Nurse Johnson",
              email: "johnson@hospital.com",
              role: "Nurse",
              department: "Emergency",
              status: "Active",
              createdAt: new Date().toISOString().split("T")[0],
            },
            {
              id: "U-004",
              name: "Admin Smith",
              email: "smith@hospital.com",
              role: "Admin",
              department: "Administration",
              status: "Active",
              createdAt: new Date().toISOString().split("T")[0],
            },
          ]
          setUsers(sampleUsers)
          localStorage.setItem("hms_users", JSON.stringify(sampleUsers))
        }

        // Load roles
        const storedRoles = localStorage.getItem("hms_roles")
        if (storedRoles) {
          setRoles(JSON.parse(storedRoles))
        } else {
          // Save default roles if none exist
          localStorage.setItem("hms_roles", JSON.stringify(roles))
        }
      } catch (error) {
        console.error("Error loading users:", error)
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        })
      }
    }

    loadUsers()
  }, [toast])

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
      description: "User list has been filtered based on your criteria",
    })
  }

  const handleEditUser = (userId: string) => {
    router.push(`/users/${userId}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewUser((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: false }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewUser((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: false }))
    }
  }

  const validateForm = () => {
    const errors = {
      name: !newUser.name,
      email: !newUser.email || !/\S+@\S+\.\S+/.test(newUser.email),
      role: !newUser.role,
      department: !newUser.department,
      password: !newUser.password || newUser.password.length < 6,
      confirmPassword: newUser.password !== newUser.confirmPassword,
    }

    setFormErrors(errors)
    return !Object.values(errors).some((error) => error)
  }

  const handleAddUser = () => {
    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      })
      return
    }

    // Generate a new user ID
    const newId = `U-${String(users.length + 1).padStart(3, "0")}`

    // Create new user object
    const user: User = {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
    }

    // Add to users array
    const updatedUsers = [...users, user]
    setUsers(updatedUsers)

    // Save to localStorage
    localStorage.setItem("hms_users", JSON.stringify(updatedUsers))

    // Show success message
    toast({
      title: "User Added",
      description: `${user.name} has been added as a ${user.role}`,
    })

    // Reset form and close dialog
    setNewUser({
      name: "",
      email: "",
      role: "",
      department: "",
      password: "",
      confirmPassword: "",
    })
    setIsAddUserDialogOpen(false)
  }

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteUser = () => {
    if (!userToDelete) return

    const updatedUsers = users.filter((user) => user.id !== userToDelete.id)
    setUsers(updatedUsers)

    // Save to localStorage
    localStorage.setItem("hms_users", JSON.stringify(updatedUsers))

    toast({
      title: "User Deleted",
      description: `${userToDelete.name} has been removed from the system`,
    })

    setIsDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  const handleRoleSelect = (roleName: string) => {
    const role = roles.find((r) => r.name === roleName)
    if (role) {
      setSelectedRole(role)
      setEditingPermissions(role.permissions)
    }
  }

  const handlePermissionChange = (permission: string, value: boolean) => {
    setEditingPermissions((prev) => ({
      ...prev,
      [permission]: value,
    }))
  }

  const handleSaveRolePermissions = () => {
    const updatedRoles = roles.map((role) =>
      role.name === selectedRole.name ? { ...role, permissions: editingPermissions } : role,
    )

    setRoles(updatedRoles)

    // Save to localStorage
    localStorage.setItem("hms_roles", JSON.stringify(updatedRoles))

    toast({
      title: "Permissions Updated",
      description: `Permissions for ${selectedRole.name} have been updated`,
    })
  }

  const handleManageRoles = () => {
    handleSaveRolePermissions()
    setIsManageRolesDialogOpen(false)
  }

  // Filter users based on search query and active tab
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "doctors") return matchesSearch && user.role === "Doctor"
    if (activeTab === "nurses") return matchesSearch && user.role === "Nurse"
    if (activeTab === "admin")
      return matchesSearch && (user.role === "Admin" || user.role === "Billing Staff" || user.role === "Lab Technician")

    return matchesSearch
  })

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
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="flex gap-2">
            <Dialog open={isManageRolesDialogOpen} onOpenChange={setIsManageRolesDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  Manage Roles
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Manage User Roles</DialogTitle>
                  <DialogDescription>Configure roles and permissions for system users.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Select Role</Label>
                    <Select value={selectedRole.name} onValueChange={handleRoleSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.name} value={role.name}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>Permissions</Label>
                    <div className="space-y-2 border rounded-md p-4">
                      {Object.entries(editingPermissions).map(([permission, enabled]) => (
                        <div key={permission} className="flex items-center justify-between py-2 border-b last:border-0">
                          <span className="capitalize">{permission}</span>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`${permission}-yes`}>Yes</Label>
                            <input
                              type="radio"
                              id={`${permission}-yes`}
                              checked={enabled}
                              onChange={() => handlePermissionChange(permission, true)}
                              className="ml-1"
                            />
                            <Label htmlFor={`${permission}-no`} className="ml-4">
                              No
                            </Label>
                            <input
                              type="radio"
                              id={`${permission}-no`}
                              checked={!enabled}
                              onChange={() => handlePermissionChange(permission, false)}
                              className="ml-1"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsManageRolesDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleManageRoles}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Create a new user account in the system.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={newUser.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Dr. Jane Smith"
                      className={formErrors.name ? "border-red-500" : ""}
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">Name is required</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newUser.email}
                      onChange={handleInputChange}
                      placeholder="e.g., jane.smith@hospital.com"
                      className={formErrors.email ? "border-red-500" : ""}
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">Valid email is required</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">
                        Role <span className="text-red-500">*</span>
                      </Label>
                      <Select value={newUser.role} onValueChange={(value) => handleSelectChange("role", value)}>
                        <SelectTrigger id="role" className={formErrors.role ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.name} value={role.name}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.role && <p className="text-red-500 text-xs mt-1">Role is required</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">
                        Department <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={newUser.department}
                        onValueChange={(value) => handleSelectChange("department", value)}
                      >
                        <SelectTrigger id="department" className={formErrors.department ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Medicine">General Medicine</SelectItem>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Emergency">Emergency</SelectItem>
                          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="Neurology">Neurology</SelectItem>
                          <SelectItem value="Administration">Administration</SelectItem>
                          <SelectItem value="Billing">Billing</SelectItem>
                          <SelectItem value="Laboratory">Laboratory</SelectItem>
                          <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.department && <p className="text-red-500 text-xs mt-1">Department is required</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        Password <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={newUser.password}
                        onChange={handleInputChange}
                        className={formErrors.password ? "border-red-500" : ""}
                      />
                      {formErrors.password && (
                        <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm Password <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={newUser.confirmPassword}
                        onChange={handleInputChange}
                        className={formErrors.confirmPassword ? "border-red-500" : ""}
                      />
                      {formErrors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>Add User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">Across all departments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((user) => user.role === "Doctor").length}</div>
              <p className="text-xs text-muted-foreground">Medical staff</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nurses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((user) => user.role === "Nurse").length}</div>
              <p className="text-xs text-muted-foreground">Support staff</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrative</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  users.filter(
                    (user) => user.role === "Admin" || user.role === "Billing Staff" || user.role === "Lab Technician",
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Management staff</p>
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
                  placeholder="Search users..."
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
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="doctors">Doctors</TabsTrigger>
                <TabsTrigger value="nurses">Nurses</TabsTrigger>
                <TabsTrigger value="admin">Administrative</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="border-none p-0 pt-4">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.id}</TableCell>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.role}</TableCell>
                              <TableCell>{user.department}</TableCell>
                              <TableCell>
                                <span className="text-xs font-medium text-green-500 bg-green-50 rounded-full px-2 py-1">
                                  {user.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleEditUser(user.id)}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteUser(user)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                              No users found matching your search criteria
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t p-4">
                    <div className="text-xs text-muted-foreground">
                      Showing {filteredUsers.length} of {users.length} users
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" disabled={filteredUsers.length < 10}>
                        Next
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="doctors" className="border-none p-0 pt-4">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.id}</TableCell>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.department}</TableCell>
                              <TableCell>
                                <span className="text-xs font-medium text-green-500 bg-green-50 rounded-full px-2 py-1">
                                  {user.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleEditUser(user.id)}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteUser(user)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              No doctors found matching your search criteria
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="nurses" className="border-none p-0 pt-4">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.id}</TableCell>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.department}</TableCell>
                              <TableCell>
                                <span className="text-xs font-medium text-green-500 bg-green-50 rounded-full px-2 py-1">
                                  {user.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleEditUser(user.id)}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteUser(user)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              No nurses found matching your search criteria
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="admin" className="border-none p-0 pt-4">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.id}</TableCell>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.role}</TableCell>
                              <TableCell>{user.department}</TableCell>
                              <TableCell>
                                <span className="text-xs font-medium text-green-500 bg-green-50 rounded-full px-2 py-1">
                                  {user.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => handleEditUser(user.id)}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteUser(user)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                              No administrative staff found matching your search criteria
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user {userToDelete?.name} ({userToDelete?.id}) from the system. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
