"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Calendar, Tag, User, AlertCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { appStore } from "@/lib/store"
import { MapView } from "@/components/map-view"
import { toast } from "sonner"

interface Issue {
  id: string
  title: string
  description: string
  category: string
  status: string
  reportedDate: string
  address: string
  coordinates: [number, number]
  distance: string
  reportedBy?: string
  image?: string
}

export default function IssuePage({ params }: { params: { id: string } }) {
  const [issue, setIssue] = useState<Issue | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState("")
  const [userRole, setUserRole] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const authenticated = localStorage.getItem("isAuthenticated")
    const username = localStorage.getItem("username")
    const role = localStorage.getItem("userRole")

    if (authenticated) {
      setIsAuthenticated(true)
      setCurrentUser(username || "")
      setUserRole(role || "user")
    }

    // Load issue data
    const issueData = appStore.getIssue(params.id)
    if (issueData) {
      setIssue(issueData)
    }
    setIsLoading(false)
  }, [params.id])

  const handleStatusUpdate = (newStatus: string) => {
    if (!issue) return

    const success = appStore.updateIssueStatus(issue.id, newStatus)
    if (success) {
      setIssue({ ...issue, status: newStatus })
      toast.success(`Issue status updated to ${newStatus}`)
    } else {
      toast.error("Failed to update issue status")
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    setIsAuthenticated(false)
    setCurrentUser("")
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Reported":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading issue details...</p>
        </div>
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center">
                <AlertCircle className="h-8 w-8 text-primary mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">CIVIC TRACK</h1>
              </Link>
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{currentUser}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/my-issues" className="flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          My Issues
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/report" className="flex items-center">
                          <Tag className="h-4 w-4 mr-2" />
                          Report Issue
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/login">
                    <Button className="bg-primary hover:bg-primary-700 text-white">Login</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Issue Not Found</h2>
            <p className="text-gray-600 mb-6">The issue you're looking for doesn't exist or has been removed.</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Issues
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <AlertCircle className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">CIVIC TRACK</h1>
            </Link>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{currentUser}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/my-issues" className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        My Issues
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/report" className="flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        Report Issue
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button className="bg-primary hover:bg-primary-700 text-white">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="flex items-center bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Issues
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{issue.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Reported on {issue.reportedDate}</span>
                      </div>
                      {issue.reportedBy && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>by {issue.reportedBy}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{issue.description}</p>
              </CardContent>
            </Card>

            {/* Issue Image */}
            {issue.image && (
              <Card>
                <CardContent className="p-0">
                  <img
                    src={issue.image || "/placeholder.svg"}
                    alt={issue.title}
                    className="w-full h-64 sm:h-80 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Location Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{issue.address}</p>
                <MapView coordinates={issue.coordinates} address={issue.address} className="h-64" />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Issue Details */}
            <Card>
              <CardHeader>
                <CardTitle>Issue Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <div className="flex items-center mt-1">
                    <Tag className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-gray-900">{issue.category}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Distance</label>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-900">{issue.distance} km away</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Reported Date</label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-900">{issue.reportedDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Actions */}
            {userRole === "admin" && (
              <Card>
                <CardHeader>
                  <CardTitle>Admin Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Update Status</label>
                      <Select value={issue.status} onValueChange={handleStatusUpdate}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Reported">Reported</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Report Actions */}
            {isAuthenticated && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/report">
                      <Button className="w-full bg-primary hover:bg-primary-700 text-white">
                        Report Similar Issue
                      </Button>
                    </Link>
                    <Link href="/my-issues">
                      <Button variant="outline" className="w-full bg-transparent">
                        View My Issues
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
