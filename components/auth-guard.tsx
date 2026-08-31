"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function AuthGuard({ children, allowedRoles = [] }: AuthGuardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("hms_user")

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    try {
      const userData = JSON.parse(user)

      // If allowedRoles is empty or includes the user's role, allow access
      if (allowedRoles.length === 0 || allowedRoles.includes(userData.role)) {
        setIsAuthorized(true)
      } else {
        toast({
          title: "Access denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        })
        router.push("/unauthorized")
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
      localStorage.removeItem("hms_user")
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }, [router, toast, allowedRoles])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return isAuthorized ? <>{children}</> : null
}
