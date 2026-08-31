"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Edit, User, Shield, Clock, Lock, Mail, Phone, MapPin, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface UserType {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: string
  lastLogin?: string
  createdAt: string
  updatedAt: string
  permissions: {
    module: string
    create: boolean
    read: boolean
    update: boolean
    delete: boolean
  }[]
  activityLog: {
    id: string
    action: string
    timestamp: string
    details: string
    ipAddress: string
  }[]
  contactInfo: {
    phone?: string
    address?: string
    emergencyContact?: {
      name: string
      relation: string
      phone: string
    }
  }
}

export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [permissions, setPermissions] = useState<UserType["permissions"]>([])

  useEffect(() => {
    // In a real application, this would be an API call
    // For now, we'll simulate fetching from localStorage
    const fetchUser = () => {
      setLoading(true)
      try {
        const storedUsers = localStorage.getItem("users")
        if (storedUsers) {
          const users = JSON.parse(storedUsers)
          const foundUser = users.find((u: UserType) => u.id === params.id)

          if (foundUser) {
            // Simulate a delay to show loading state
            setTimeout(() => {
              setUser(foundUser)
              setPermissions(foundUser.permissions)
              setLoading(false)
            }, 500)
          } else {
            toast({
              title: "User not found",
              description: "The requested user could not be found.",
              variant: "destructive",
            })
            router.push("/users")
          }
        } else {
          // If no users in storage, use mock data
          const mockUser: UserType = {
            id: params.id as string,
            name: "Dr. Sarah Smith",
            email: "sarah.smith@hospital.com",
            role: "Doctor",
            department: "Cardiology",
            status: "Active",
            lastLogin: "2023-05-15 09:30:22",
            createdAt: "2022-01-15",
            updatedAt: "2023-04-10",
            permissions: [
              {
                module: "Patients",
                create: true,
                read: true,
                update: true,
                delete: false,
              },
              {
                module: "Appointments",
                create: true,
                read: true,
                update: true,
                delete: true,
              },
              {
                module: "Medical Records",
                create: true,
                read: true,
                update: true,
                delete: false,
              },
              {
                module: "Prescriptions",
                create: true,
                read: true,
                update: true,
                delete: false,
              },
              {
                module: "Laboratory",
                create: false,
                read: true,
                update: false,
                delete: false,
              },
              {
                module: "Billing",
                create: false,
                read: true,
                update: false,
                delete: false,
              },
              {
                module: "Users",
                create: false,
                read: false,
                update: false,
                delete: false,
              },
            ],
            activityLog: [
              {
                id: "act-001",
                action: "Login",
                timestamp: "2023-05-15 09:30:22",
                details: "User logged in successfully",
                ipAddress: "192.168.1.105",
              },
              {
                id: "act-002",
                action: "View Patient",
                timestamp: "2023-05-15 09:45:18",
                details: "Viewed patient record: John Doe (P12345)",
                ipAddress: "192.168.1.105",
              },
              {
                id: "act-003",
                action: "Update Medical Record",
                timestamp: "2023-05-15 10:15:42",
                details: "Updated medical record for patient: John Doe (P12345)",
                ipAddress: "192.168.1.105",
              },
              {
                id: "act-004",
                action: "Create Prescription",
                timestamp: "2023-05-15 10:22:30",
                details: "Created prescription for patient: John Doe (P12345)",
                ipAddress: "192.168.1.105",
              },
              {
                id: "act-005",
                action: "Logout",
                timestamp: "2023-05-15 17:45:12",
                details: "User logged out",
                ipAddress: "192.168.1.105",
              },
            ],
            contactInfo: {
              phone: "+1 (555) 123-4567",
              address: "123 Medical Center Dr, Anytown, USA",
              emergencyContact: {
                name: "John Smith",
                relation: "Spouse",
                phone: "+1 (555) 987-6543",
              },
            },
          }

          setTimeout(() => {
            setUser(mockUser)
            setPermissions(mockUser.permissions)
            setLoading(false)
          }, 500)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchUser()
  }, [params.id, router, toast])

  const handleEditUser = () => {
    toast({
      title: "Edit User",
      description: `Editing user: ${user?.name}`,
    })
    // In a real app, this would navigate to an edit form or open a modal
  }

  const handleBackToList = () => {
    router.push("/users")
  }

  const handleResetPassword = () => {
    toast({
      title: "Reset Password",
      description: `Password reset link sent to ${user?.email}`,
    })
    // In a real app, this would trigger a password reset email
  }

  const handleToggleStatus = () => {
    const newStatus = user?.status === "Active" ? "Inactive" : "Active"
    toast({
      title: `User ${newStatus}`,
      description: `User status changed to ${newStatus}`,
      variant: newStatus === "Active" ? "default" : "destructive",
    })
    // In a real app, this would update the user status
  }

  const handleUpdatePermissions = () => {
    toast({
      title: "Permissions Updated",
      description: "User permissions have been updated successfully.",
    })
    // In a real app, this would save the updated permissions
  }

  const handleTogglePermission = (moduleIndex: number, permissionType: "create" | "read" | "update" | "delete") => {
    const updatedPermissions = [...permissions]
    updatedPermissions[moduleIndex] = {
      ...updatedPermissions[moduleIndex],
      [permissionType]: !updatedPermissions[moduleIndex][permissionType],
    }
    setPermissions(updatedPermissions)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Loading user information...</CardTitle>
            <CardDescription>Please wait while we fetch the user details.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-gray-200 h-24 w-24 mb-4"></div>
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

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">User Not Found</CardTitle>
            <CardDescription>The requested user could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please return to the users list and select a valid user.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleBackToList}>Return to Users List</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "Suspended":
        return <Badge variant="destructive">Suspended</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" onClick={handleBackToList}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <Button size="sm" onClick={handleEditUser}>
          <Edit className="h-4 w-4 mr-2" />
          Edit User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`/placeholder.svg?height=96&width=96`} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-center text-2xl">{user.name}</CardTitle>
            <CardDescription className="text-center">
              {user.role} - {user.department}
            </CardDescription>
            <div className="flex justify-center mt-2">{getStatusBadge(user.status)}</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Account Information</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Email:</div>
                  <div className="text-sm flex items-center">
                    <Mail className="h-3 w-3 mr-1 text-gray-400" />
                    {user.email}
                  </div>
                  <div className="text-sm font-medium">Status:</div>
                  <div className="text-sm">{getStatusBadge(user.status)}</div>
                  <div className="text-sm font-medium">Created:</div>
                  <div className="text-sm">{user.createdAt}</div>
                  <div className="text-sm font-medium">Last Updated:</div>
                  <div className="text-sm">{user.updatedAt}</div>
                  {user.lastLogin && (
                    <>
                      <div className="text-sm font-medium">Last Login:</div>
                      <div className="text-sm">{user.lastLogin}</div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                <Separator className="my-2" />
                <div className="space-y-2">
                  {user.contactInfo.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm">{user.contactInfo.phone}</span>
                    </div>
                  )}
                  {user.contactInfo.address && (
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                      <span className="text-sm">{user.contactInfo.address}</span>
                    </div>
                  )}
                  {user.contactInfo.emergencyContact && (
                    <div className="mt-2">
                      <div className="text-sm font-medium">Emergency Contact:</div>
                      <div className="text-sm ml-6 mt-1">
                        <div>{user.contactInfo.emergencyContact.name}</div>
                        <div className="text-gray-500">
                          {user.contactInfo.emergencyContact.relation} • {user.contactInfo.emergencyContact.phone}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Button variant="outline" onClick={handleResetPassword}>
                  <Lock className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
                <Button variant={user.status === "Active" ? "destructive" : "default"} onClick={handleToggleStatus}>
                  {user.status === "Active" ? (
                    <>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Deactivate Account
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4 mr-2" />
                      Activate Account
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user permissions and view activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="permissions">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="permissions">
                  <Shield className="h-4 w-4 mr-2" />
                  Permissions
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <Clock className="h-4 w-4 mr-2" />
                  Activity Log
                </TabsTrigger>
              </TabsList>

              <TabsContent value="permissions" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Role-based Permissions</h3>
                    <Button size="sm" onClick={handleUpdatePermissions}>
                      Save Changes
                    </Button>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[180px]">Module</TableHead>
                          <TableHead className="text-center">Create</TableHead>
                          <TableHead className="text-center">Read</TableHead>
                          <TableHead className="text-center">Update</TableHead>
                          <TableHead className="text-center">Delete</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {permissions.map((permission, index) => (
                          <TableRow key={permission.module}>
                            <TableCell className="font-medium">{permission.module}</TableCell>
                            <TableCell className="text-center">
                              <Switch
                                checked={permission.create}
                                onCheckedChange={() => handleTogglePermission(index, "create")}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Switch
                                checked={permission.read}
                                onCheckedChange={() => handleTogglePermission(index, "read")}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Switch
                                checked={permission.update}
                                onCheckedChange={() => handleTogglePermission(index, "update")}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Switch
                                checked={permission.delete}
                                onCheckedChange={() => handleTogglePermission(index, "delete")}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Permission Changes</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Changes to permissions will take effect immediately. Users may need to log out and log back in
                          to see the changes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Recent Activity</h3>

                  {user.activityLog.length > 0 ? (
                    <div className="space-y-4">
                      {user.activityLog.map((activity) => (
                        <div key={activity.id} className="flex items-start">
                          <div className="flex flex-col items-center mr-4">
                            <div className="rounded-full h-8 w-8 flex items-center justify-center bg-blue-100 text-blue-800">
                              <Clock className="h-4 w-4" />
                            </div>
                            {activity.id !== user.activityLog[user.activityLog.length - 1].id && (
                              <div className="h-full w-0.5 bg-gray-200 mt-2"></div>
                            )}
                          </div>
                          <div className="bg-gray-50 p-3 rounded-md w-full">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium">{activity.action}</p>
                              <p className="text-xs text-gray-500">{activity.timestamp}</p>
                            </div>
                            <p className="text-sm mt-1">{activity.details}</p>
                            <p className="text-xs text-gray-500 mt-1">IP: {activity.ipAddress}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity</h3>
                      <p className="text-gray-500">No activity has been recorded for this user.</p>
                    </div>
                  )}

                  <div className="flex justify-center mt-4">
                    <Button variant="outline">View Full Activity Log</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <div className="w-full flex justify-between">
              <Button variant="outline" onClick={handleBackToList}>
                Back to Users List
              </Button>
              <Button onClick={handleEditUser}>
                <Edit className="h-4 w-4 mr-2" />
                Edit User
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
