"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <ShieldAlert className="h-10 w-10 text-red-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page. Please contact your administrator if you believe this is an
            error.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/">
            <Button
              className="w-full"
              onClick={() => {
                // Check if user is logged in before redirecting to dashboard
                const userData = localStorage.getItem("hms_user")
                if (!userData) {
                  // If not logged in, redirect to login instead
                  window.location.href = "/login"
                  return
                }
              }}
            >
              Return to Dashboard
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // Clear the current user session
                localStorage.removeItem("hms_user")
              }}
            >
              Login with Different Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
