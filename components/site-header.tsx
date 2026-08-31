import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LogOut, HelpCircle, User, Bell, Search } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 shadow-subtle">
      <div className="flex items-center gap-3">
        <div className="bg-white rounded-full p-1 shadow-subtle">
          <Image src="/images/logo.png" alt="Helwan National University Logo" width={40} height={40} />
        </div>
        <Link href="/" className="flex items-center">
          <h1 className="text-xl font-semibold text-primary">Helwan National University Hospital</h1>
        </Link>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 rounded-md border border-input bg-background pl-8 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            3
          </span>
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Help</span>
        </Button>
        <Button size="sm" variant="secondary" className="gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </Button>
        <Button size="sm" variant="ghost">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
