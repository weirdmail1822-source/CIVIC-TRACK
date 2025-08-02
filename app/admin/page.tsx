"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  LogOut,
  User,
  BarChart3,
  Flag,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle,
  Ban,
  UserCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { appStore } from "@/lib/store"
import { toast } from "sonner"

export default function AdminPage() {
  const [username, setUsername] = useState("")
  const [analytics, setAnalytics] = useState<any>(null)
  const [spamReports, setSpamReports] = useState<any[]>([])
  const [hiddenIssues, setHiddenIssues] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [selectedIssue, setSelectedIssue] = useState<any>(null)
  const router = useRouter()
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      ipAddress: "192.168.1.1",
      status: "active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      ipAddress: "10.0.0.2",
      status: "banned",
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      ipAddress: "172.16.0.3",
      status: "active",
    },
  ])
  const [issues, setIssues] = useState([
    {
      id: 101,
      reporterId: 1,
      title: "Pothole on Main Street",
      description: "A large pothole is causing damage to vehicles.",
      status: "reported",
    },
    {
      id: 102,
      reporterId: 2,
      title: "Streetlight Outage",
      description: "The streetlight at the corner of Elm and Oak is not working.",
      status: "in progress",
    },
    {
      id: 103,
      reporterId: 1,
      title: "Graffiti on Building",
      description: "There is graffiti on the side of the community center.",
      status: "resolved",
    },
  ])
  const [totalIssues, setTotalIssues] = useState(100)

  useEffect(() => {
    // Check admin authentication
    const isAuth = localStorage.getItem("isAuthenticated")
    const storedUsername = localStorage.getItem("username")
    const userRole = localStorage.getItem("userRole")

    if (!isAuth || userRole !== "admin") {
      router.push("/login")
      return
    }

    if (storedUsername) {
      setUsername(storedUsername)
    }

    // Load admin data
    loadAdminData()
  }, [router])

  const loadAdminData = () => {
    const analyticsData = appStore.getAnalytics()
    setAnalytics(analyticsData)

    const allIssues = appStore.getAllIssues()
    const spamReportedIssues = allIssues.filter((issue) => issue.spamReports.length > 0)
    const hiddenIssuesList = allIssues.filter((issue) => issue.isHidden)

    setSpamReports(spamReportedIssues)
    setHiddenIssues(hiddenIssuesList)
    setAllUsers(appStore.getAllUsers())
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("username")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const handleUpdateStatus = (issueId: number, newStatus: string) => {
    appStore.updateIssueStatus(issueId, newStatus)
    toast.success(`Issue status updated to ${newStatus}`)
    loadAdminData()
  }

  const handleUnhideIssue = (issueId: number) => {
    appStore.unhideIssue(issueId)
    toast.success("Issue has been unhidden and spam reports cleared")
    loadAdminData()
  }

  const handleBanUser = (username: string) => {
    appStore.banUser(username)
    toast.success(`User ${username} has been banned`)
    loadAdminData()
  }

  const handleUnbanUser = (username: string) => {
    appStore.unbanUser(username)
    toast.success(`User ${username} has been unbanned`)
    loadAdminData()
  }

  const handleViewIssue = (issue: any) => {
    setSelectedIssue(issue)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Reported":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "In Progress":
        return "bg-primary-100 text-primary-800 border-primary-200"
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-secondary-200 text-secondary-800 border-secondary-300"
    }
  }

  const toggleUserStatus = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "banned" : "active" } : user,
      ),
    )
  }

  if (!analytics) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-secondary-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center">
              <AlertCircle className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">CIVIC TRACK - ADMIN</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-700">
                <User className="h-4 w-4 mr-1" />
                <span>Admin: {username}</span>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <BarChart3 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total Issues</p>
                          <p className="text-2xl font-bold text-gray-900">{analytics.totalIssues}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>All Issues</DialogTitle>
                    <DialogDescription>Review and manage all reported issues</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {appStore.getAllIssues().map((issue) => (
                      <div key={issue.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{issue.title}</h4>
                          <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                        <div className="text-xs text-gray-500 mb-3">
                          <p>
                            Reported by: {issue.reportedBy} on {issue.reportedDate}
                          </p>
                          <p>Address: {issue.address}</p>
                          <p>Category: {issue.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <Select
                            value={issue.status}
                            onValueChange={(newStatus) => handleUpdateStatus(issue.id, newStatus)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Reported">Reported</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                          <Link href={`/issue/${issue.id}`}>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Flag className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Spam Reports</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.spamReports}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <EyeOff className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Hidden Issues</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.hiddenIssues}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Most Reported</p>
                      <p className="text-lg font-bold text-gray-900">{analytics.mostReportedCategory}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Issues by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.categoryStats).map(([category, count]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category}</span>
                        <Badge variant="secondary">{count as number}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Issues by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.statusStats).map(([status, count]) => (
                      <div key={status} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{status}</span>
                        <Badge className={getStatusColor(status)}>{count as number}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="border-[#b4a7d6]/20">
              <CardHeader>
                <CardTitle className="text-[#674ea7]">Reports by Location</CardTitle>
                <CardDescription>Issue reports from different IP addresses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { ip: "192.168.1.100", location: "Downtown Area", reports: Math.floor(totalIssues * 0.3) },
                    { ip: "10.0.0.50", location: "Residential District", reports: Math.floor(totalIssues * 0.25) },
                    { ip: "172.16.0.25", location: "Business District", reports: Math.floor(totalIssues * 0.2) },
                    { ip: "192.168.2.75", location: "Suburban Area", reports: Math.floor(totalIssues * 0.15) },
                    { ip: "203.0.113.45", location: "Industrial Zone", reports: Math.floor(totalIssues * 0.1) },
                  ].map((item) => (
                    <div
                      key={item.ip}
                      className="flex justify-between items-center p-3 border border-[#b4a7d6]/20 rounded-lg"
                    >
                      <div>
                        <span className="font-mono text-sm text-[#674ea7]">{item.ip}</span>
                        <p className="text-xs text-gray-500">{item.location}</p>
                      </div>
                      <Badge variant="secondary">{item.reports} reports</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Flag className="h-5 w-5 mr-2 text-red-600" />
                    Spam Reports
                  </CardTitle>
                  <CardDescription>Issues flagged by users as spam</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {spamReports.map((issue) => (
                      <div key={issue.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{issue.title}</h4>
                          <Badge variant="destructive">{issue.spamReports.length} reports</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                        <div className="text-xs text-gray-500 mb-3">
                          <p>Reported by: {issue.reportedBy}</p>
                          <p>Category: {issue.category}</p>
                          <p>Spam reported by: {issue.spamReports.join(", ")}</p>
                        </div>
                        <div className="flex gap-2">
                          <Select
                            value={issue.status}
                            onValueChange={(newStatus) => handleUpdateStatus(issue.id, newStatus)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Reported">Reported</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="outline" onClick={() => handleUnhideIssue(issue.id)}>
                            Clear Spam
                          </Button>
                          <Link href={`/issue/${issue.id}`}>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    {spamReports.length === 0 && <p className="text-gray-500 text-center py-4">No spam reports</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <EyeOff className="h-5 w-5 mr-2 text-yellow-600" />
                    Hidden Issues
                  </CardTitle>
                  <CardDescription>Issues auto-hidden due to multiple spam reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {hiddenIssues.map((issue) => (
                      <div key={issue.id} className="border rounded-lg p-4 bg-red-50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{issue.title}</h4>
                          <Badge variant="secondary">Hidden</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                        <div className="text-xs text-gray-500 mb-3">
                          <p>Reported by: {issue.reportedBy}</p>
                          <p>Category: {issue.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleUnhideIssue(issue.id)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Unhide
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    {hiddenIssues.length === 0 && <p className="text-gray-500 text-center py-4">No hidden issues</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="border-[#b4a7d6]/20">
              <CardHeader>
                <CardTitle className="text-[#674ea7]">User Management</CardTitle>
                <CardDescription>Manage registered users and their access</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Issues Reported</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">#{index + 1}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {user.ipAddress || `192.168.1.${Math.floor(Math.random() * 255)}`}
                        </TableCell>
                        <TableCell>{issues.filter((issue) => issue.reporterId === user.id).length}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === "active" ? "default" : "destructive"}
                            className={
                              user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {user.status || "active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#b4a7d6] text-[#674ea7] bg-transparent"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={user.status === "banned" ? "default" : "destructive"}
                              onClick={() => toggleUserStatus(user.id)}
                              className={user.status === "banned" ? "bg-green-600 hover:bg-green-700" : ""}
                            >
                              {user.status === "banned" ? (
                                <UserCheck className="h-4 w-4" />
                              ) : (
                                <Ban className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
