"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  Ban,
  UserCheck,
  Calendar,
  MapPin,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { Dashboard } from "./components/Dashboard"

export default function AdminDashboard() {
  const { currentUser, issues, users, updateIssueStatus } = useStore()
  const router = useRouter()
  const [selectedIssues, setSelectedIssues] = useState<any[]>([])
  const [showIssuesDialog, setShowIssuesDialog] = useState(false)

  useEffect(() => {
    if (!currentUser || currentUser.email !== "admin@civictrack.com") {
      router.push("/login")
    }
  }, [currentUser, router])

  if (!currentUser || currentUser.email !== "admin@civictrack.com") {
    return null
  }

  const totalIssues = issues.length
  const pendingIssues = issues.filter((issue) => issue.status === "pending").length
  const inProgressIssues = issues.filter((issue) => issue.status === "in-progress").length
  const resolvedIssues = issues.filter((issue) => issue.status === "resolved").length
  const totalUsers = users.length

  const recentIssues = issues
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
    .slice(0, 5)
    .map((issue) => ({
      id: issue.id,
      title: issue.title,
      category: issue.category,
      status: issue.status,
      reportedAt: new Date(issue.reportedAt).toLocaleDateString(),
      location: issue.address,
    }))

  const handleStatusChange = (issueId: string, newStatus: string) => {
    updateIssueStatus(issueId, newStatus)
  }

  const handleViewAllIssues = () => {
    setSelectedIssues(issues)
    setShowIssuesDialog(true)
  }

  const toggleUserStatus = (userId: string) => {
    // This would typically update user status in the store
    console.log("Toggle user status:", userId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b4a7d6] to-[#674ea7]">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">CIVIC TRACK - Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-white text-[#674ea7]">AD</AvatarFallback>
              </Avatar>
              <div className="text-white">
                <p className="font-medium">Admin User</p>
                <p className="text-sm opacity-90">admin@civictrack.com</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="moderation">Issue Moderation</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card
                  className="border-[#b4a7d6]/20 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={handleViewAllIssues}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Issues</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-[#674ea7]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#674ea7]">{totalIssues}</div>
                    <p className="text-xs text-gray-500 mt-1">Click to view all</p>
                  </CardContent>
                </Card>

                <Card className="border-[#b4a7d6]/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{pendingIssues}</div>
                  </CardContent>
                </Card>

                <Card className="border-[#b4a7d6]/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{inProgressIssues}</div>
                  </CardContent>
                </Card>

                <Card className="border-[#b4a7d6]/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{resolvedIssues}</div>
                  </CardContent>
                </Card>

                <Card className="border-[#b4a7d6]/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
                  </CardContent>
                </Card>
              </div>

              <Dashboard
                totalIssues={totalIssues}
                pendingIssues={pendingIssues}
                resolvedIssues={resolvedIssues}
                totalUsers={totalUsers}
                recentIssues={recentIssues}
              />
            </TabsContent>

            <TabsContent value="moderation" className="space-y-6">
              <Card className="border-[#b4a7d6]/20">
                <CardHeader>
                  <CardTitle className="text-[#674ea7]">Issue Moderation</CardTitle>
                  <CardDescription>Review and manage reported issues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {issues.map((issue) => (
                      <div
                        key={issue.id}
                        className="flex items-center justify-between p-4 border border-[#b4a7d6]/20 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#674ea7]">{issue.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {issue.address}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(issue.reportedAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {issue.reporterName}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-[#b4a7d6] text-[#674ea7]">
                            {issue.category}
                          </Badge>
                          <Select value={issue.status} onValueChange={(value) => handleStatusChange(issue.id, value)}>
                            <SelectTrigger className="w-32 border-[#b4a7d6]/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
      </main>

      {/* All Issues Dialog */}
      <Dialog open={showIssuesDialog} onOpenChange={setShowIssuesDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#674ea7]">All Issues ({totalIssues})</DialogTitle>
            <DialogDescription>Complete list of all reported issues with details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedIssues.map((issue) => (
              <div key={issue.id} className="p-4 border border-[#b4a7d6]/20 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-[#674ea7]">{issue.title}</h4>
                  <Badge
                    variant={issue.status === "resolved" ? "default" : "secondary"}
                    className={
                      issue.status === "resolved" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                    }
                  >
                    {issue.status}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-3">{issue.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="border-[#b4a7d6] text-[#674ea7]">
                      {issue.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {issue.address}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(issue.reportedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {issue.reporterName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
