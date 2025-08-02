"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  FileText,
  PlusCircle,
  Settings,
  Search,
  Moon,
  Sun,
  User,
  LogOut,
  Bell,
  MapPin,
  BarChart3,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { appStore } from "@/lib/store"

interface DashboardLayoutProps {
  children: React.ReactNode
  currentUser?: string
}

export function DashboardLayout({ children, currentUser = "user" }: DashboardLayoutProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [userIssues, setUserIssues] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (currentUser) {
      const userData = appStore.getUser(currentUser)
      setUser(userData)
      const issues = appStore.getUserIssues(currentUser)
      setUserIssues(issues)
    }
  }, [currentUser])

  const handleLogout = () => {
    // Clear any stored auth data
    localStorage.removeItem("currentUser")
    router.push("/login")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const navigationItems = [
    {
      title: "Overview",
      icon: <Home className="h-4 w-4" />,
      href: "/dashboard",
    },
    {
      title: "All Issues",
      icon: <FileText className="h-4 w-4" />,
      href: "/",
    },
    {
      title: "Report Issue",
      icon: <PlusCircle className="h-4 w-4" />,
      href: "/report",
    },
    {
      title: "Map View",
      icon: <MapPin className="h-4 w-4" />,
      href: "/map",
    },
  ]

  const adminItems =
    user?.role === "admin"
      ? [
          {
            title: "Admin Dashboard",
            icon: <Shield className="h-4 w-4" />,
            href: "/admin",
          },
          {
            title: "Analytics",
            icon: <BarChart3 className="h-4 w-4" />,
            href: "/admin/analytics",
          },
        ]
      : []

  const myIssuesItems = userIssues.slice(0, 5).map((issue) => ({
    title: issue.title,
    status: issue.status,
    href: `/issue/${issue.id}`,
  }))

  return (
    <SidebarProvider>
      <Sidebar variant="inset" className="border-r">
        <SidebarHeader className="border-b bg-gradient-to-r from-[#b4a7d6] to-[#674ea7]">
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#674ea7] font-bold">
              CT
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight text-white">
              <span className="truncate font-semibold">CivicTrack</span>
              <span className="truncate text-xs text-white/80">Community Platform</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* Search */}
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="relative px-3">
                <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 bg-background"
                />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator />

          {/* Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href} className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Admin Section */}
          {adminItems.length > 0 && (
            <>
              <Separator />
              <SidebarGroup>
                <SidebarGroupLabel>Administration</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link href={item.href} className="flex items-center gap-2">
                            {item.icon}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </>
          )}

          {/* My Issues */}
          <Separator />
          <SidebarGroup>
            <SidebarGroupLabel>
              My Issues
              <Badge variant="secondary" className="ml-2">
                {userIssues.length}
              </Badge>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {myIssuesItems.length > 0 ? (
                  myIssuesItems.map((issue) => (
                    <SidebarMenuItem key={issue.title}>
                      <SidebarMenuButton asChild>
                        <Link href={issue.href} className="flex items-center justify-between">
                          <span className="truncate">{issue.title}</span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              issue.status === "Resolved"
                                ? "bg-green-50 text-green-700"
                                : issue.status === "In Progress"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-yellow-50 text-yellow-700"
                            }`}
                          >
                            {issue.status}
                          </Badge>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <SidebarMenuItem>
                    <div className="px-2 py-1 text-sm text-muted-foreground">No issues reported yet</div>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Settings */}
          <Separator />
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="flex items-center justify-between px-2 py-1">
                    <div className="flex items-center gap-2">
                      {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      <span className="text-sm">Dark Mode</span>
                    </div>
                    <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Preferences</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="/placeholder-user.jpg" alt={currentUser} />
                      <AvatarFallback className="rounded-lg bg-gradient-to-br from-[#b4a7d6] to-[#674ea7] text-white">
                        {currentUser?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{currentUser}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.email || `${currentUser}@example.com`}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src="/placeholder-user.jpg" alt={currentUser} />
                        <AvatarFallback className="rounded-lg bg-gradient-to-br from-[#b4a7d6] to-[#674ea7] text-white">
                          {currentUser?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{currentUser}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {user?.email || `${currentUser}@example.com`}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Welcome back, {currentUser}</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
