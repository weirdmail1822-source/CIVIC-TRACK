"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, Plus, FileText, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { appStore } from "@/lib/store"

export default function DashboardPage() {
  const [username, setUsername] = useState("")
  const [userIssues, setUserIssues] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("isAuthenticated")
    const storedUsername = localStorage.getItem("username")

    if (!isAuth) {
      router.push("/login")
      return
    }

    if (storedUsername) {
      setUsername(storedUsername)
      // Get user's actual submitted issues
      setUserIssues(appStore.getUserIssues(storedUsername))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("username")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    router.push("/")
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-secondary-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center">
              <AlertCircle className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">CIVIC TRACK</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-700">
                <User className="h-4 w-4 mr-1" />
                <span>Welcome, {username}</span>
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
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                My Issues
              </CardTitle>
              <CardDescription>View and manage your reported issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userIssues.map((issue) => (
                  <Link key={issue.id} href={`/issue/${issue.id}`}>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <h4 className="font-medium">{issue.title}</h4>
                        <p className="text-sm text-gray-500">
                          {issue.category} • {issue.reportedDate}
                        </p>
                      </div>
                      <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                    </div>
                  </Link>
                ))}
                {userIssues.length === 0 && <p className="text-gray-500 text-center py-4">No issues reported yet</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-6 w-6 mr-2 text-green-600" />
                Report New Issue
              </CardTitle>
              <CardDescription>Report a new civic issue in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/report">
                <Button className="w-full bg-primary hover:bg-primary-700 text-white" size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Report New Issue
                </Button>
              </Link>
              <div className="mt-4 text-sm text-gray-600">
                <p>Help improve your community by reporting:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Roads (potholes, obstructions)</li>
                  <li>Lighting (broken or flickering lights)</li>
                  <li>Water Supply (leaks, low pressure)</li>
                  <li>Cleanliness (overflowing bins, garbage)</li>
                  <li>Public Safety (open manholes, exposed wiring)</li>
                  <li>Obstructions (fallen trees, debris)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{userIssues.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userIssues.filter((issue) => issue.status === "Reported").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userIssues.filter((issue) => issue.status === "Resolved").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
