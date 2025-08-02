"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, LogOut, User, BarChart3, Flag, Users, Eye, EyeOff, Trash2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { appStore } from "@/lib/store"
import { toast } from "sonner"

export default function AdminPage() {
  const [username, setUsername] = useState("")
  const [analytics, setAnalytics] = useState<any>(null)
  const [spamReports, setSpamReports] = useState<any[]>([])
  const [hiddenIssues, setHiddenIssues] = useState<any[]>([])
  const router = useRouter()

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
              <Card>
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
                        <p className="text-sm text-gray-600 mb-2">{issue.description.substring(0, 100)}...</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(issue.id, "Resolved")}>
                            Mark Valid
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleUnhideIssue(issue.id)}>
                            Remove Spam
                          </Button>
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
                        <p className="text-sm text-gray-600 mb-2">{issue.description.substring(0, 100)}...</p>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  User Management
                </CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>admin</TableCell>
                      <TableCell>admin@civictrack.com</TableCell>
                      <TableCell>
                        <Badge className="bg-primary-100 text-primary-800">Admin</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    {/* Add more users here as they register */}
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
