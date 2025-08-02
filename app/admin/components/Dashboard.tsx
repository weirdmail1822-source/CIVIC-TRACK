"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  MapPin,
  Search,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  BarChart3,
} from "lucide-react"

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data
  const stats = {
    totalIssues: 1247,
    resolved: 892,
    inProgress: 234,
    spam: 121,
  }

  const recentIssues = [
    {
      id: 1,
      title: "Broken streetlight on Main St",
      category: "Infrastructure",
      status: "In Progress",
      priority: "High",
      location: "Main Street, Downtown",
      reportedBy: "John Doe",
      date: "2024-01-15",
      hidden: false,
    },
    {
      id: 2,
      title: "Potholes on Oak Avenue",
      category: "Roads",
      status: "Open",
      priority: "Medium",
      location: "Oak Avenue, Residential",
      reportedBy: "Jane Smith",
      date: "2024-01-14",
      hidden: false,
    },
    {
      id: 3,
      title: "Graffiti in Central Park",
      category: "Vandalism",
      status: "Resolved",
      priority: "Low",
      location: "Central Park",
      reportedBy: "Mike Johnson",
      date: "2024-01-13",
      hidden: true,
    },
  ]

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Citizen",
      reportsCount: 5,
      joinDate: "2023-12-01",
      status: "Active",
      banned: false,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Citizen",
      reportsCount: 12,
      joinDate: "2023-11-15",
      status: "Active",
      banned: false,
    },
    {
      id: 3,
      name: "Spam User",
      email: "spam@example.com",
      role: "Citizen",
      reportsCount: 25,
      joinDate: "2024-01-10",
      status: "Banned",
      banned: true,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "open":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage issues, users, and community reports</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-gradient-to-r from-[#b4a7d6] to-[#674ea7] text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIssues}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">-3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spam Reports</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.spam}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="issues" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="issues">Issues Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Issues Management Tab */}
        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Issues</CardTitle>
              <CardDescription>Manage and moderate community-reported issues</CardDescription>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search issues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIssues.map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{issue.title}</h3>
                        <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                        <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                        {issue.hidden && <Badge variant="secondary">Hidden</Badge>}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <MapPin className="w-4 h-4 inline mr-1" />
                          {issue.location}
                        </p>
                        <p>
                          Reported by: {issue.reportedBy} on {issue.date}
                        </p>
                        <p>Category: {issue.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        {issue.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        {issue.hidden ? "Show" : "Hide"}
                      </Button>
                      <Button
                        variant={issue.status === "Resolved" ? "outline" : "default"}
                        size="sm"
                        className={
                          issue.status !== "Resolved" ? "bg-gradient-to-r from-[#b4a7d6] to-[#674ea7] text-white" : ""
                        }
                      >
                        {issue.status === "Resolved" ? "Reopen" : "Resolve"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{user.name}</h3>
                        <Badge variant={user.banned ? "destructive" : "secondary"}>{user.status}</Badge>
                        <Badge variant="outline">{user.role}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Email: {user.email}</p>
                        <p>
                          Reports: {user.reportsCount} | Joined: {user.joinDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant={user.banned ? "default" : "destructive"} size="sm">
                        {user.banned ? (
                          <>
                            <UserCheck className="w-4 h-4 mr-1" />
                            Unban
                          </>
                        ) : (
                          <>
                            <UserX className="w-4 h-4 mr-1" />
                            Ban
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Issue Categories</CardTitle>
                <CardDescription>Distribution of reported issues by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: "Infrastructure", count: 45, percentage: 35 },
                    { category: "Roads", count: 32, percentage: 25 },
                    { category: "Environment", count: 28, percentage: 22 },
                    { category: "Safety", count: 23, percentage: 18 },
                  ].map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#b4a7d6] to-[#674ea7] h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resolution Time</CardTitle>
                <CardDescription>Average time to resolve issues by priority</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { priority: "High", time: "2.3 days", color: "bg-red-500" },
                    { priority: "Medium", time: "5.7 days", color: "bg-orange-500" },
                    { priority: "Low", time: "12.1 days", color: "bg-green-500" },
                  ].map((item) => (
                    <div key={item.priority} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-sm font-medium">{item.priority} Priority</span>
                      </div>
                      <span className="text-sm text-gray-600">{item.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
