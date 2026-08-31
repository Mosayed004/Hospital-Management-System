"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, RefreshCw, Database, Moon, Sun, Laptop } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import AuthGuard from "@/components/auth-guard"
import { Separator } from "@/components/ui/separator"

interface SystemSettings {
  general: {
    hospitalName: string
    address: string
    phone: string
    email: string
    website: string
    logo: string
  }
  appearance: {
    theme: "light" | "dark" | "system"
    primaryColor: string
    accentColor: string
    sidebarCollapsed: boolean
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    appointmentReminders: boolean
    systemUpdates: boolean
  }
  security: {
    twoFactorAuth: boolean
    passwordExpiry: number
    sessionTimeout: number
    loginAttempts: number
  }
  backup: {
    autoBackup: boolean
    backupFrequency: string
    backupLocation: string
    lastBackup: string
  }
}

export default function SettingsPage() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <Settings />
    </AuthGuard>
  )
}

function Settings() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      hospitalName: "City General Hospital",
      address: "123 Medical Center Dr, Anytown, USA",
      phone: "+1 (555) 123-4567",
      email: "info@citygeneralhospital.com",
      website: "www.citygeneralhospital.com",
      logo: "/images/logo.png",
    },
    appearance: {
      theme: "light",
      primaryColor: "#0f766e",
      accentColor: "#14b8a6",
      sidebarCollapsed: false,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      appointmentReminders: true,
      systemUpdates: true,
    },
    security: {
      twoFactorAuth: false,
      passwordExpiry: 90,
      sessionTimeout: 30,
      loginAttempts: 5,
    },
    backup: {
      autoBackup: true,
      backupFrequency: "daily",
      backupLocation: "cloud",
      lastBackup: "2023-05-15 09:30:22",
    },
  })

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const storedSettings = localStorage.getItem("hms_settings")
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings))
        } else {
          // Save default settings if none exist
          localStorage.setItem("hms_settings", JSON.stringify(settings))
        }
      } catch (error) {
        console.error("Error loading settings:", error)
        toast({
          title: "Error",
          description: "Failed to load system settings",
          variant: "destructive",
        })
      }
    }

    loadSettings()
  }, [toast])

  const handleInputChange = (section: keyof SystemSettings, field: string, value: string | number | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleSaveSettings = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      try {
        // Save to localStorage
        localStorage.setItem("hms_settings", JSON.stringify(settings))

        toast({
          title: "Settings Saved",
          description: "Your system settings have been updated successfully",
        })
      } catch (error) {
        console.error("Error saving settings:", error)
        toast({
          title: "Error",
          description: "Failed to save system settings",
          variant: "destructive",
        })
      } finally {
        setIsSaving(false)
      }
    }, 1000)
  }

  const handleResetSettings = () => {
    // Reset to default settings
    const defaultSettings: SystemSettings = {
      general: {
        hospitalName: "City General Hospital",
        address: "123 Medical Center Dr, Anytown, USA",
        phone: "+1 (555) 123-4567",
        email: "info@citygeneralhospital.com",
        website: "www.citygeneralhospital.com",
        logo: "/images/logo.png",
      },
      appearance: {
        theme: "light",
        primaryColor: "#0f766e",
        accentColor: "#14b8a6",
        sidebarCollapsed: false,
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: true,
        appointmentReminders: true,
        systemUpdates: true,
      },
      security: {
        twoFactorAuth: false,
        passwordExpiry: 90,
        sessionTimeout: 30,
        loginAttempts: 5,
      },
      backup: {
        autoBackup: true,
        backupFrequency: "daily",
        backupLocation: "cloud",
        lastBackup: new Date().toISOString(),
      },
    }

    setSettings(defaultSettings)

    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values",
    })
  }

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    handleInputChange("appearance", "theme", theme)

    // In a real app, this would update the theme in the DOM
    document.documentElement.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      document.documentElement.classList.add(systemTheme)
    } else {
      document.documentElement.classList.add(theme)
    }
  }

  const handleBackup = () => {
    setIsSaving(true)

    // Simulate backup process
    setTimeout(() => {
      const now = new Date().toLocaleString()

      handleInputChange("backup", "lastBackup", now)

      // Save to localStorage
      localStorage.setItem(
        "hms_settings",
        JSON.stringify({
          ...settings,
          backup: {
            ...settings.backup,
            lastBackup: now,
          },
        }),
      )

      toast({
        title: "Backup Complete",
        description: `System backup completed successfully at ${now}`,
      })

      setIsSaving(false)
    }, 2000)
  }

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
            onClick={() => toast({ title: "Help", description: "Opening settings help guide" })}
          >
            Help
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">System Settings</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleResetSettings}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Defaults
            </Button>
            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic information about your healthcare facility.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Hospital Name</Label>
                  <Input
                    id="hospitalName"
                    value={settings.general.hospitalName}
                    onChange={(e) => handleInputChange("general", "hospitalName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={settings.general.address}
                    onChange={(e) => handleInputChange("general", "address", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={settings.general.phone}
                      onChange={(e) => handleInputChange("general", "phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.general.email}
                      onChange={(e) => handleInputChange("general", "email", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={settings.general.website}
                    onChange={(e) => handleInputChange("general", "website", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <div className="flex items-center gap-4">
                    <img
                      src={settings.general.logo || "/placeholder.svg"}
                      alt="Hospital Logo"
                      className="h-16 w-16 rounded-md border object-contain p-1"
                    />
                    <Button variant="outline">Change Logo</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={handleResetSettings}>
                  Reset
                </Button>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of the hospital management system.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex gap-4">
                    <Button
                      variant={settings.appearance.theme === "light" ? "default" : "outline"}
                      className="flex flex-col items-center gap-2 h-auto py-4"
                      onClick={() => handleThemeChange("light")}
                    >
                      <Sun className="h-6 w-6" />
                      <span>Light</span>
                    </Button>
                    <Button
                      variant={settings.appearance.theme === "dark" ? "default" : "outline"}
                      className="flex flex-col items-center gap-2 h-auto py-4"
                      onClick={() => handleThemeChange("dark")}
                    >
                      <Moon className="h-6 w-6" />
                      <span>Dark</span>
                    </Button>
                    <Button
                      variant={settings.appearance.theme === "system" ? "default" : "outline"}
                      className="flex flex-col items-center gap-2 h-auto py-4"
                      onClick={() => handleThemeChange("system")}
                    >
                      <Laptop className="h-6 w-6" />
                      <span>System</span>
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-4">
                    <div
                      className="h-10 w-10 rounded-full border"
                      style={{ backgroundColor: settings.appearance.primaryColor }}
                    />
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => handleInputChange("appearance", "primaryColor", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center gap-4">
                    <div
                      className="h-10 w-10 rounded-full border"
                      style={{ backgroundColor: settings.appearance.accentColor }}
                    />
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.appearance.accentColor}
                      onChange={(e) => handleInputChange("appearance", "accentColor", e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sidebarCollapsed">Collapsed Sidebar</Label>
                    <p className="text-sm text-muted-foreground">Start with the sidebar collapsed by default</p>
                  </div>
                  <Switch
                    id="sidebarCollapsed"
                    checked={settings.appearance.sidebarCollapsed}
                    onCheckedChange={(checked) => handleInputChange("appearance", "sidebarCollapsed", checked)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={handleResetSettings}>
                  Reset
                </Button>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how and when notifications are sent.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => handleInputChange("notifications", "emailNotifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) => handleInputChange("notifications", "smsNotifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="appointmentReminders">Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send reminders for upcoming appointments</p>
                  </div>
                  <Switch
                    id="appointmentReminders"
                    checked={settings.notifications.appointmentReminders}
                    onCheckedChange={(checked) => handleInputChange("notifications", "appointmentReminders", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="systemUpdates">System Updates</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications about system updates</p>
                  </div>
                  <Switch
                    id="systemUpdates"
                    checked={settings.notifications.systemUpdates}
                    onCheckedChange={(checked) => handleInputChange("notifications", "systemUpdates", checked)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={handleResetSettings}>
                  Reset
                </Button>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security settings for the hospital management system.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require two-factor authentication for all users</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => handleInputChange("security", "twoFactorAuth", checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="passwordExpiry"
                      type="number"
                      min={0}
                      value={settings.security.passwordExpiry}
                      onChange={(e) => handleInputChange("security", "passwordExpiry", Number.parseInt(e.target.value))}
                      className="w-24"
                    />
                    <p className="text-sm text-muted-foreground">Days before passwords expire (0 = never)</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min={1}
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleInputChange("security", "sessionTimeout", Number.parseInt(e.target.value))}
                      className="w-24"
                    />
                    <p className="text-sm text-muted-foreground">Minutes of inactivity before automatic logout</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Failed Login Attempts</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="loginAttempts"
                      type="number"
                      min={1}
                      value={settings.security.loginAttempts}
                      onChange={(e) => handleInputChange("security", "loginAttempts", Number.parseInt(e.target.value))}
                      className="w-24"
                    />
                    <p className="text-sm text-muted-foreground">Number of failed attempts before account lockout</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={handleResetSettings}>
                  Reset
                </Button>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Restore</CardTitle>
                <CardDescription>Configure system backup settings and restore from previous backups.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoBackup">Automatic Backup</Label>
                    <p className="text-sm text-muted-foreground">Automatically backup system data</p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={settings.backup.autoBackup}
                    onCheckedChange={(checked) => handleInputChange("backup", "autoBackup", checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select
                    value={settings.backup.backupFrequency}
                    onValueChange={(value) => handleInputChange("backup", "backupFrequency", value)}
                    disabled={!settings.backup.autoBackup}
                  >
                    <SelectTrigger id="backupFrequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupLocation">Backup Location</Label>
                  <Select
                    value={settings.backup.backupLocation}
                    onValueChange={(value) => handleInputChange("backup", "backupLocation", value)}
                  >
                    <SelectTrigger id="backupLocation">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Storage</SelectItem>
                      <SelectItem value="cloud">Cloud Storage</SelectItem>
                      <SelectItem value="both">Both (Local & Cloud)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Last Backup</h4>
                      <p className="text-sm text-muted-foreground">
                        {settings.backup.lastBackup || "No backup has been performed yet"}
                      </p>
                    </div>
                    <Button onClick={handleBackup} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Database className="mr-2 h-4 w-4 animate-pulse" />
                          Backing up...
                        </>
                      ) : (
                        <>
                          <Database className="mr-2 h-4 w-4" />
                          Backup Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Restore from Backup</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select a backup file to restore the system to a previous state
                  </p>
                  <div className="flex items-center gap-4">
                    <Input type="file" disabled={isSaving} />
                    <Button variant="outline" disabled={isSaving}>
                      Restore
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={handleResetSettings}>
                  Reset
                </Button>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
