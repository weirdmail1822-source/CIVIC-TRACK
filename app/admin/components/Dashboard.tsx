"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Users, FileText, TrendingUp, Eye, EyeOff, Ban, UserCheck, Trash2 } from "lucide-react"
import { appStore } from "@/lib/store"
import { toast } from "sonner"

interface Issue {
  id: number
  title: string
  description: string
  category: string
  status: string
  address: string
  reportedDate: string
  reportedTime: string
  reportedBy: string
  distance: string
  image: string
  coordinates?: { lat: number; lng: number }
  spamReports: string[]
  isHidden: boolean
}

interface User {
  username: string
  email: string
  role: "user" | "admin"
  isBanned: boolean
}

export function Dashboard() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [analytics, setAnalytics] = useState<any>({})
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setIssues(appStore.getAllIssues())
    setUsers(appStore.getAllUsers())
    setAnalytics(appStore.getAnalytics())
  }

  const handleStatusUpdate = (issueId: number, newStatus: string) => {
    appStore.updateIssueStatus(issueId, newStatus)
    loadData()
    toast.success("Issue status updated successfully")
  }

  const handleDeleteIssue = (issueId: number) => {
    if (confirm("Are you sure you want to delete this issue?")) {
      appStore.deleteIssue(issueId)
      loadData()
      toast.success("Issue deleted successfully")
    }
  }

  const handleToggleIssueVisibility = (issueId: number, isHidden: boolean) => {
    if (isHidden) {
      appStore.unhideIssue(issueId)
      toast.success("Issue unhidden successfully")
    } else {
      const issue = issues.find((i) => i.id === issueId)
      if (issue) {
        appStore.updateIssue(issueId, { isHidden: true })
        toast.success("Issue hidden successfully")
      }
    }
    loadData()
  }

  const handleBanUser = (username: string, isBanned: boolean) => {
    if (isBanned) {
      appStore.unbanUser(username)
      toast.success("User unbanned successfully")
    } else {
      appStore.banUser(username)
      toast.success("User banned successfully")
    }
    loadData()
  }

  const filteredIssues = issues.filter((issue) => {
    const matchesStatus = selectedStatus === "all" || issue.status === selectedStatus
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Reported":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      case "Closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-[#b4a7d6] to-[#674ea7] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <FileText className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalIssues || 0}</div>
            <p className="text-xs text-white/80">All reported issues</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#b4a7d6] to-[#674ea7] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => !u.isBanned).length}</div>
            <p className="text-xs text-white/80">Registered users</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#b4a7d6] to-[#674ea7] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spam Reports</CardTitle>
            <AlertTriangle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.spamReports || 0}</div>
            <p className="text-xs text-white/80">Issues with spam reports</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#b4a7d6] to-[#674ea7] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalIssues
                ? Math.round(((analytics.statusStats?.Resolved || 0) / analytics.totalIssues) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-white/80">Issues resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="issues" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="issues">Issues Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Issues Management</CardTitle>
              <CardDescription>Manage all reported issues, update statuses, and moderate content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Input
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Reported">Reported</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Spam Reports</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIssues.map((issue) => (
                      <TableRow key={issue.id} className={issue.isHidden ? "opacity-50" : ""}>
                        <TableCell className="font-medium">
                          {issue.title}
                          {issue.isHidden && (
                            <Badge variant="secondary" className="ml-2">
                              Hidden
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{issue.category}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                        </TableCell>
                        <TableCell>{issue.reportedBy}</TableCell>
                        <TableCell>{issue.reportedDate}</TableCell>
                        <TableCell>
                          {issue.spamReports.length > 0 && (
                            <Badge variant="destructive">{issue.spamReports.length}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select value={issue.status} onValueChange={(value) => handleStatusUpdate(issue.id, value)}>
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Reported">Reported</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleIssueVisibility(issue.id, issue.isHidden)}
                            >
                              {issue.isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>

                            <Button variant="destructive" size="sm" onClick={() => handleDeleteIssue(issue.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts, ban/unban users, and monitor user activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Issues Reported</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.username}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isBanned ? "destructive" : "default"}>
                            {user.isBanned ? "Banned" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>{issues.filter((issue) => issue.reportedBy === user.username).length}</TableCell>
                        <TableCell>
                          {user.role !== "admin" && (
                            <Button
                              variant={user.isBanned ? "default" : "destructive"}
                              size="sm"
                              onClick={() => handleBanUser(user.username, user.isBanned)}
                            >
                              {user.isBanned ? (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Unban
                                </>
                              ) : (
                                <>
                                  <Ban className="h-4 w-4 mr-2" />
                                  Ban
                                </>
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Issues by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.categoryStats || {}).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#b4a7d6] to-[#674ea7] h-2 rounded-full"
                            style={{
                              width: `${((count as number) / analytics.totalIssues) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{count as number}</span>
                      </div>
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
                <div className="space-y-4">
                  {Object.entries(analytics.statusStats || {}).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{status}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-[#b4a7d6] to-[#674ea7] h-2 rounded-full"
                            style={{
                              width: `${((count as number) / analytics.totalIssues) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{count as number}</span>
                      </div>
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
