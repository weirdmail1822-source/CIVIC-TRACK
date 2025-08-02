"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { AlertCircle, Edit, Trash2, Flag, MapPin, Calendar, Tag, Clock, CheckCircle, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { appStore } from "@/lib/store"
import { MapView } from "@/components/map-view"
import { toast } from "sonner"

export default function IssueDetailPage() {
  const [username, setUsername] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [issue, setIssue] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    address: "",
  })
  const router = useRouter()
  const params = useParams()
  const issueId = Number.parseInt(params.id as string)

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("isAuthenticated")
    const storedUsername = localStorage.getItem("username")

    setIsAuthenticated(!!isAuth)

    if (storedUsername) {
      setUsername(storedUsername)
    }

    // Get issue from store
    const foundIssue = appStore.getIssueById(issueId)
    setIssue(foundIssue)

    if (foundIssue) {
      setEditForm({
        title: foundIssue.title,
        description: foundIssue.description,
        category: foundIssue.category,
        address: foundIssue.address,
      })
    }
  }, [issueId])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("username")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const handleReportSpam = () => {
    if (!isAuthenticated) {
      toast.error("Please login to report spam")
      return
    }

    appStore.reportSpam(issueId, username)
    toast.success("Issue reported as spam. Thank you for helping keep our community safe.")

    // Refresh issue data
    const updatedIssue = appStore.getIssueById(issueId)
    setIssue(updatedIssue)
  }

  const handleEditIssue = () => {
    if (!appStore.updateIssue(issueId, editForm)) {
      toast.error("Failed to update issue")
      return
    }

    toast.success("Issue updated successfully")
    setIsEditing(false)

    // Refresh issue data
    const updatedIssue = appStore.getIssueById(issueId)
    setIssue(updatedIssue)
  }

  const handleDeleteIssue = () => {
    if (!appStore.deleteIssue(issueId)) {
      toast.error("Failed to delete issue")
      return
    }

    toast.success("Issue deleted successfully")
    router.push("/dashboard")
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

  const getActivityIcon = (status: string) => {
    switch (status) {
      case "Reported":
        return <Flag className="h-4 w-4" />
      case "In Progress":
        return <Clock className="h-4 w-4" />
      case "Resolved":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Issue Not Found</h2>
          <p className="text-gray-600 mb-4">The issue you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Mock activity data
  const activity = [
    {
      status: "Reported",
      date: issue.reportedDate,
      time: issue.reportedTime,
      description: "Issue reported by user",
    },
  ]

  if (issue.status === "In Progress" || issue.status === "Resolved") {
    activity.push({
      status: "In Progress",
      date: issue.reportedDate,
      time: "09:15",
      description: "Assigned to maintenance team",
    })
  }

  if (issue.status === "Resolved") {
    activity.push({
      status: "Resolved",
      date: issue.reportedDate,
      time: "14:30",
      description: "Issue has been resolved",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-secondary-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center">
              <AlertCircle className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">CIVIC TRACK</h1>
            </Link>
            <div className="flex items-center space-x-4">
              {isAuthenticated && issue.reportedBy === username && (
                <>
                  <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Issue</DialogTitle>
                        <DialogDescription>Update the details of your reported issue</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Title</label>
                          <Input
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            placeholder="Issue title"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Description</label>
                          <Textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            placeholder="Describe the issue"
                            rows={4}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Category</label>
                          <Select
                            value={editForm.category}
                            onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Roads">Roads</SelectItem>
                              <SelectItem value="Lighting">Lighting</SelectItem>
                              <SelectItem value="Water Supply">Water Supply</SelectItem>
                              <SelectItem value="Cleanliness">Cleanliness</SelectItem>
                              <SelectItem value="Public Safety">Public Safety</SelectItem>
                              <SelectItem value="Obstructions">Obstructions</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Address</label>
                          <Input
                            value={editForm.address}
                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                            placeholder="Issue location"
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleEditIssue} className="bg-primary hover:bg-primary-700">
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Issue</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this issue? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex gap-2 pt-4">
                        <Button variant="destructive" onClick={handleDeleteIssue}>
                          Delete Issue
                        </Button>
                        <Button variant="outline">Cancel</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              {isAuthenticated ? (
                <>
                  <div className="flex items-center text-sm text-gray-700">
                    <User className="h-4 w-4 mr-1" />
                    <span>{username}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button className="bg-primary hover:bg-primary-700 text-white">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Half - Image and Details */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <img
                  src={issue.image || "/placeholder.svg"}
                  alt={issue.title}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
                    <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        Reported on {issue.reportedDate} at {issue.reportedTime}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      <span>Reported by {issue.reportedBy}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Tag className="h-4 w-4 mr-2" />
                      <span className="text-primary-600 font-medium">{issue.category}</span>
                    </div>
                    {issue.spamReports.length > 0 && (
                      <div className="flex items-center text-sm text-red-600">
                        <Flag className="h-4 w-4 mr-2" />
                        <span>{issue.spamReports.length} spam report(s)</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{issue.description}</p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={handleReportSpam}
                    disabled={!isAuthenticated || issue.spamReports.includes(username)}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    {issue.spamReports.includes(username) ? "Already Reported" : "Report as Spam"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Half - Address and Status Tracking */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{issue.address}</p>
                <MapView coordinates={issue.coordinates} address={issue.address} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activity.map((activityItem, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${getStatusColor(activityItem.status)}`}>
                        {getActivityIcon(activityItem.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{activityItem.status}</h4>
                          <span className="text-sm text-gray-500">
                            {activityItem.date} {activityItem.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activityItem.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer - Activity Timeline */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium">Reported by User</span>
              </div>
              <div className="flex-1 h-0.5 bg-secondary-300 mx-4"></div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded-full ${issue.status === "In Progress" || issue.status === "Resolved" ? "bg-primary" : "bg-secondary-300"}`}
                ></div>
                <span className="text-sm font-medium">In Progress</span>
              </div>
              <div className="flex-1 h-0.5 bg-secondary-300 mx-4"></div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded-full ${issue.status === "Resolved" ? "bg-green-500" : "bg-secondary-300"}`}
                ></div>
                <span className="text-sm font-medium">Resolved</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
