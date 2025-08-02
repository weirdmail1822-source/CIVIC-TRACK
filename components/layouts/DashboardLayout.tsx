"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
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
  Plus,
  Search,
  Settings,
  Users,
  FileText,
  BarChart3,
  Moon,
  Sun,
  LogOut,
  User,
  Bell,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [username, setUsername] = useState("")
  const [userRole, setUserRole] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    const storedUserRole = localStorage.getItem("userRole")

    if (storedUsername) setUsername(storedUsername)
    if (storedUserRole) setUserRole(storedUserRole)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("username")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Mock user issues data
  const userIssues = [
    { id: 1, title: "Broken Street Light", status: "In Progress", category: "Street Lighting" },
    { id: 2, title: "Pothole on Main St", status: "Resolved", category: "Road Maintenance" },
    { id: 3, title: "Garbage Collection", status: "Reported", category: "Waste Management" },
  ]

  const navigationItems = [
    {
      title: "Overview",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: Home },
        { title: "All Issues", url: "/", icon: FileText },
        { title: "Report Issue", url: "/report", icon: Plus },
      ],
    },
    {
      title: "Community",
      items: [
        { title: "My Issues", url: "/dashboard/my-issues", icon: User },
        { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
      ],
    },
  ]

  if (userRole === "admin") {
    navigationItems.push({
      title: "Administration",
      items: [
        { title: "Admin Panel", url: "/admin", icon: Shield },
        { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
        { title: "User Management", url: "/admin/users", icon: Users },
      ],
    })
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset" className="bg-gradient-to-b from-[#b4a7d6] to-[#674ea7]">
        <SidebarHeader className="border-b border-white/20">
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white/20 text-white">
              <AlertTriangle className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-white">CIVIC TRACK</span>
              <span className="truncate text-xs text-white/70">Community Platform</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/70" />
              <Input
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
              />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {navigationItems.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel className="text-white/90">{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="text-white/80 hover:bg-white/20 hover:text-white">
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}

          {/* My Issues Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-white/90">My Issues</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2 px-2">
                {userIssues.map((issue) => (
                  <div key={issue.id} className="p-2 rounded-lg bg-white/10 border border-white/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-white truncate">{issue.title}</span>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          issue.status === "Resolved"
                            ? "bg-green-100 text-green-800"
                            : issue.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {issue.status === "Resolved" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {issue.status === "In Progress" && <Clock className="h-3 w-3 mr-1" />}
                        {issue.status === "Reported" && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {issue.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-white/70">{issue.category}</span>
                  </div>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-white/20">
          {/* Report Issue Button */}
          <div className="px-2 pb-2">
            <Button asChild className="w-full bg-white text-[#674ea7] hover:bg-gray-100">
              <Link href="/report">
                <Plus className="h-4 w-4 mr-2" />
                Report Issue
              </Link>
            </Button>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-white/80">Dark Mode</span>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-white/60" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-white/30"
              />
              <Moon className="h-4 w-4 text-white/60" />
            </div>
          </div>

          {/* User Profile */}
          <div className="px-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-white text-[#674ea7]">
                      {username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{username}</span>
                    <span className="text-xs text-white/70 capitalize">{userRole}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/report">
                <Plus className="h-4 w-4 mr-2" />
                Report Issue
              </Link>
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
