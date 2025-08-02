"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
  SidebarSeparator,
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
  Shield,
  BarChart3,
  Users,
  MapPin,
  AlertTriangle,
} from "lucide-react"
import { useTheme } from "next-themes"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder-user.jpg",
    role: "Admin",
  }

  // Navigation items
  const navigationItems = [
    {
      title: "Overview",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: Home },
        { title: "My Issues", url: "/dashboard/issues", icon: FileText },
        { title: "Report Issue", url: "/report", icon: PlusCircle },
      ],
    },
    {
      title: "Community",
      items: [
        { title: "All Issues", url: "/dashboard/all-issues", icon: AlertTriangle },
        { title: "Map View", url: "/dashboard/map", icon: MapPin },
        { title: "Statistics", url: "/dashboard/stats", icon: BarChart3 },
      ],
    },
  ]

  // Admin navigation items
  const adminItems = [
    { title: "Admin Panel", url: "/admin", icon: Shield },
    { title: "User Management", url: "/admin/users", icon: Users },
    { title: "Reports", url: "/admin/reports", icon: BarChart3 },
  ]

  const isActive = (url: string) => pathname === url

  return (
    <SidebarProvider>
      <Sidebar variant="inset" className="border-r">
        <SidebarHeader className="border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#b4a7d6] to-[#674ea7] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CT</span>
            </div>
            <div>
              <h2 className="font-semibold text-lg">Civic Track</h2>
              <p className="text-xs text-muted-foreground">Community Dashboard</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-4 py-4">
          {/* Search */}
          <SidebarGroup>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </SidebarGroup>

          <SidebarSeparator />

          {/* Navigation */}
          {navigationItems.map((section) => (
            <SidebarGroup key={section.title}>
              <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <Link href={item.url} className="flex items-center gap-3">
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

          {/* Report Issue Button */}
          <SidebarGroup>
            <Button asChild className="w-full bg-gradient-to-r from-[#b4a7d6] to-[#674ea7] text-white hover:opacity-90">
              <Link href="/report">
                <PlusCircle className="h-4 w-4 mr-2" />
                Report an Issue
              </Link>
            </Button>
          </SidebarGroup>

          <SidebarSeparator />

          {/* My Issues Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-between">
              My Issues
              <Badge variant="secondary" className="text-xs">
                3
              </Badge>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                  <span className="truncate">Broken streetlight</span>
                  <Badge variant="outline" className="text-xs">
                    Open
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                  <span className="truncate">Pothole on Main St</span>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                    Progress
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                  <span className="truncate">Graffiti removal</span>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    Resolved
                  </Badge>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {/* Admin Section (if user is admin) */}
          {user.role === "Admin" && (
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <Link href={item.url} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Settings */}
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/settings")}>
                    <Link href="/settings" className="flex items-center gap-3">
                      <Settings className="h-4 w-4" />
                      <span>Preferences</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t p-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Dark Mode</span>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
              <Moon className="h-4 w-4" />
            </div>
          </div>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
