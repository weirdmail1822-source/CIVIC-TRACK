"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, MapPin, Calendar, Tag, AlertCircle, Map, Plus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { appStore } from "@/lib/store"
import { MapView } from "@/components/map-view"

const getCategoryImage = (category: string, title: string, issueImage?: string) => {
  // If the issue has a specific image, use it
  if (issueImage) {
    return issueImage
  }

  // Otherwise, use category-based placeholder images
  const categoryImages = {
    Roads: "/placeholder.svg?height=200&width=300&text=Road+Issue",
    Lighting: "/placeholder.svg?height=200&width=300&text=Street+Light",
    "Water Supply": "/placeholder.svg?height=200&width=300&text=Water+Leak",
    Cleanliness: "/placeholder.svg?height=200&width=300&text=Garbage+Issue",
    "Public Safety": "/placeholder.svg?height=200&width=300&text=Safety+Hazard",
    Obstructions: "/placeholder.svg?height=200&width=300&text=Obstruction",
  }

  return (
    categoryImages[category as keyof typeof categoryImages] ||
    `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(title)}`
  )
}

export default function MyIssuesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [issues, setIssues] = useState<any[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check authentication status
    const authenticated = localStorage.getItem("isAuthenticated")
    const username = localStorage.getItem("username")

    if (!authenticated) {
      router.push("/login")
      return
    }

    setIsAuthenticated(true)
    setCurrentUser(username || "")

    // Get user's issues
    const userIssues = appStore.getIssuesByUser(username || "")
    setIssues(userIssues)
  }, [router])

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter

    return matchesSearch && matchesStatus
  })

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

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-secondary-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-primary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">My Issues</h1>
            </div>
            <Link href="/report">
              <Button className="bg-primary hover:bg-primary-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Report New Issue
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {currentUser}!</h2>
          <p className="text-gray-600">
            Here are all the issues you've reported. You have {issues.length} total reports.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search your issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Reported">Reported</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Issues Grid */}
        {filteredIssues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="p-0">
                  <img
                    src={getCategoryImage(issue.category, issue.title, issue.image) || "/placeholder.svg"}
                    alt={issue.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/issue/${issue.id}`}>
                      <h3 className="font-semibold text-lg hover:text-primary">{issue.title}</h3>
                    </Link>
                    <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{issue.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="truncate">{issue.address}</span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-auto p-1 h-auto">
                            <Map className="h-4 w-4 text-primary" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Location - {issue.title}</DialogTitle>
                            <DialogDescription>{issue.address}</DialogDescription>
                          </DialogHeader>
                          <MapView coordinates={issue.coordinates} address={issue.address} className="h-96" />
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{issue.reportedDate}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{issue.distance} km</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <Tag className="h-4 w-4 mr-1 text-blue-500" />
                      <span className="text-primary-600 font-medium">{issue.category}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all" ? "No matching issues found" : "No issues reported yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Start by reporting your first civic issue to help improve your community."}
            </p>
            <Link href="/report">
              <Button className="bg-primary hover:bg-primary-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Report Your First Issue
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
