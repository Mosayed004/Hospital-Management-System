"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Users,
  CalendarClock,
  FileText,
  Pill,
  FlaskRoundIcon as Flask,
  CreditCard,
  Settings,
  User,
  Home,
  Stethoscope,
  ChevronDown,
  HelpCircle,
  LogOut,
} from "lucide-react"
import { useState } from "react"
import Image from "next/image"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Patients",
    href: "/patients",
    icon: Users,
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: CalendarClock,
  },
  {
    title: "Medical Records",
    href: "/records",
    icon: FileText,
  },
  {
    title: "Pharmacy",
    href: "/pharmacy",
    icon: Pill,
  },
  {
    title: "Laboratory",
    href: "/laboratory",
    icon: Flask,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    title: "Doctor Dashboard",
    href: "/doctor-dashboard",
    icon: Stethoscope,
  },
  {
    title: "Users",
    href: "/users",
    icon: User,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="hidden border-r bg-card shadow-subtle md:block md:w-64">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-full p-0.5 shadow-subtle">
              <Image src="/images/logo.png" alt="Helwan National University Logo" width={28} height={28} />
            </div>
            <span className="font-semibold text-primary">HNU Hospital</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <div className="px-3 py-2">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Main Menu</h3>
              <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground hover:text-foreground">
                <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
            </div>
            <nav className="grid items-start text-sm font-medium">
              {sidebarItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn("sidebar-item", pathname === item.href ? "sidebar-item-active" : "")}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="mt-auto border-t p-4">
          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-sm">Dr. Ahmed Hassan</div>
                <div className="text-xs text-muted-foreground">Administrator</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="w-full">
                <HelpCircle className="mr-1 h-3 w-3" />
                <span className="text-xs">Help</span>
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <LogOut className="mr-1 h-3 w-3" />
                <span className="text-xs">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Button({ children, variant, size, className }) {
  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
      default:
        return "bg-primary text-primary-foreground hover:bg-primary/90"
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-8 rounded-md px-3 text-xs"
      default:
        return "h-10 px-4 py-2"
    }
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        getVariantClasses(),
        getSizeClasses(),
        className,
      )}
    >
      {children}
    </button>
  )
}
