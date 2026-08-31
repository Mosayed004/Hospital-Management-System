"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    rememberMe: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate authentication delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, we'll accept any email with a valid format and any password
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Error",
          description: "Please enter a valid email address",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Store user info in localStorage for persistence across the app
      const userData = {
        email: formData.email,
        role: formData.role,
        name: getUserNameByRole(formData.role),
        isAuthenticated: true,
      }

      localStorage.setItem("hms_user", JSON.stringify(userData))

      toast({
        title: "Success",
        description: `Logged in successfully as ${userData.name}`,
      })

      // Redirect based on role
      setTimeout(() => {
        switch (formData.role) {
          case "doctor":
            router.push("/doctor-dashboard")
            break
          case "admin":
            router.push("/")
            break
          case "nurse":
            router.push("/patients")
            break
          case "lab":
            router.push("/laboratory")
            break
          case "pharmacy":
            router.push("/pharmacy")
            break
          case "billing":
            router.push("/billing")
            break
          default:
            router.push("/")
        }
      }, 500) // Small delay to ensure toast is shown before navigation
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to get user name based on role
  const getUserNameByRole = (role: string): string => {
    switch (role) {
      case "doctor":
        return "Dr. Williams"
      case "admin":
        return "Admin User"
      case "nurse":
        return "Nurse Johnson"
      case "lab":
        return "Lab Technician"
      case "pharmacy":
        return "Pharmacist"
      case "billing":
        return "Billing Staff"
      default:
        return "User"
    }
  }

  // For testing purposes - pre-fill the form with demo credentials
  const fillDemoCredentials = () => {
    setFormData({
      email: "demo@hospital.com",
      password: "password123",
      role: "admin",
      rememberMe: true,
    })
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Image src="/images/logo.png" alt="Helwan National University Logo" width={80} height={80} />
            </div>
            <CardTitle className="text-2xl text-center">Helwan National University Hospital</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange} required>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="lab">Laboratory Technician</SelectItem>
                    <SelectItem value="pharmacy">Pharmacist</SelectItem>
                    <SelectItem value="billing">Billing Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" checked={formData.rememberMe} onCheckedChange={handleCheckboxChange} />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              <div className="flex justify-between w-full text-sm mt-2">
                <Link href="#" className="text-primary hover:underline">
                  Forgot your password?
                </Link>
                <button type="button" onClick={fillDemoCredentials} className="text-primary hover:underline">
                  Use demo account
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
      <div className="hidden lg:block relative w-1/2 bg-muted">
        <Image src="/placeholder.svg?height=1080&width=1920" alt="Hospital" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 flex items-center">
          <div className="p-12 text-white max-w-lg">
            <h1 className="text-4xl font-bold mb-6">Welcome to Helwan National University Hospital</h1>
            <p className="text-lg mb-6">
              A comprehensive solution for managing hospital operations, patient records, and administrative tasks.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-primary-foreground"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Patient Management
              </li>
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-primary-foreground"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Appointment Scheduling
              </li>
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-primary-foreground"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Medical Records
              </li>
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-primary-foreground"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Billing & Payments
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
