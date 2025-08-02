"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, Clock, Plus, TrendingUp, Calendar, MapPin } from "lucide-react"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const { currentUser, issues } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
    }
  }, [currentUser, router])

  if (!currentUser) {
    return null
  }

  const userIssues = issues.filter((issue) => issue.reporterId === currentUser.id)
  const pendingIssues = userIssues.filter((issue) => issue.status === "pending")
  const inProgressIssues = userIssues.filter((issue) => issue.status === "in-progress")
  const resolvedIssues = userIssues.filter((issue) => issue.status === "resolved")

  const recentIssues = userIssues
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
    .slice(0, 3)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-orange-100 text-orange-800"
    }
  }

  const getProgressValue = (status: string) => {
    switch (status) {
      case "resolved":
        return 100
      case "in-progress":
        return 60
      default:
        return 20
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b4a7d6] to-[#674ea7]">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">CIVIC TRACK - Dashboard</h1>
            <div className="flex items-center gap-4">
              <Button asChild className="bg-white text-[#674ea7] hover:bg-gray-100">
                <a href="/report">
                  <Plus className="w-4 h-4 mr-2" />
                  Report Issue
                </a>
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-white text-[#674ea7]">
                  {currentUser.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-white">
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-sm opacity-90">{currentUser.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#674ea7] mb-2">Welcome back, {currentUser.name}!</h2>
            <p className="text-gray-600">Here's an overview of your civic engagement activities.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-[#b4a7d6]/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-[#674ea7]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#674ea7]">{userIssues.length}</div>
              </CardContent>
            </Card>

            <Card className="border-[#b4a7d6]/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{pendingIssues.length}</div>
              </CardContent>
            </Card>

            <Card className="border-[#b4a7d6]/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{inProgressIssues.length}</div>
              </CardContent>
            </Card>

            <Card className="border-[#b4a7d6]/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{resolvedIssues.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Issues */}
          <Card className="border-[#b4a7d6]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#674ea7]">Your Recent Issues</CardTitle>
                  <CardDescription>Track the progress of your reported issues</CardDescription>
                </div>
                <Button asChild variant="outline" className="border-[#b4a7d6] text-[#674ea7] bg-transparent">
                  <a href="/">View All Issues</a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentIssues.length > 0 ? (
                <div className="space-y-4">
                  {recentIssues.map((issue) => (
                    <div key={issue.id} className="p-4 border border-[#b4a7d6]/20 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#674ea7] mb-1">{issue.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {issue.address}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(issue.reportedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline" className="border-[#b4a7d6] text-[#674ea7]">
                            {issue.category}
                          </Badge>
                          <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-[#674ea7] font-medium">{getProgressValue(issue.status)}%</span>
                        </div>
                        <Progress value={getProgressValue(issue.status)} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto h-12 w-12 text-[#b4a7d6] mb-4" />
                  <h3 className="text-lg font-semibold text-[#674ea7] mb-2">No Issues Reported Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start making a difference in your community by reporting your first issue.
                  </p>
                  <Button asChild className="bg-[#674ea7] hover:bg-[#674ea7]/90">
                    <a href="/report">
                      <Plus className="w-4 h-4 mr-2" />
                      Report Your First Issue
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
