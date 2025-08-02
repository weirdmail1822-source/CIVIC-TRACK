"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  MapPin,
  Calendar,
  Tag,
  AlertCircle,
  Map,
  Plus,
  ArrowLeft,
  Flag,
  MoreVertical,
  User,
} from "lucide-react"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { appStore } from "@/lib/store"
import { MapView } from "@/components/map-view"
import { useToast } from "@/hooks/use-toast"

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

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [distanceFilter, setDistanceFilter] = useState("all")
  const [issues, setIssues] = useState<any[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState("")
  const router = useRouter()
  const { toast } = useToast()

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

    // Get all issues
    const allIssues = appStore.getIssues()
    setIssues(allIssues)
  }, [router])

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    const matchesDistance =
      distanceFilter === "all" ||
      (distanceFilter === "near" && Number.parseFloat(issue.distance) <= 1) ||
      (distanceFilter === "medium" &&
        Number.parseFloat(issue.distance) > 1 &&
        Number.parseFloat(issue.distance) <= 3) ||
      (distanceFilter === "far" && Number.parseFloat(issue.distance) > 3)

    return matchesSearch && matchesCategory && matchesStatus && matchesDistance
  })

  const handleFlagAsSpam = (issueId: string, issueTitle: string) => {
    const success = appStore.reportSpam(issueId, currentUser)
    if (success) {
      toast({
        title: "Issue Flagged",
        description: `"${issueTitle}" has been flagged as spam. Thank you for helping keep our community clean.`,
      })
      // Refresh the issues list
      const allIssues = appStore.getIssues()
      setIssues(allIssues)
    } else {
      toast({
        title: "Already Flagged",
        description: "You have already flagged this issue as spam.",
        variant: "destructive",
      })
    }
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
              <h1 className="text-xl font-bold text-gray-900">Community Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/my-issues">
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  My Issues
                </Button>
              </Link>
              <Link href="/report">
                <Button className="bg-primary hover:bg-primary-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Community Dashboard, {currentUser}!</h2>
          <p className="text-gray-600">
            Here are all the civic issues reported by community members. Help make your neighborhood better!
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Roads">Roads</SelectItem>
                <SelectItem value="Lighting">Lighting</SelectItem>
                <SelectItem value="Water Supply">Water Supply</SelectItem>
                <SelectItem value="Cleanliness">Cleanliness</SelectItem>
                <SelectItem value="Public Safety">Public Safety</SelectItem>
                <SelectItem value="Obstructions">Obstructions</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Reported">Reported</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={distanceFilter} onValueChange={setDistanceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Distances" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Distances</SelectItem>
                <SelectItem value="near">Near (&lt;=1 km)</SelectItem>
                <SelectItem value="medium">Medium (1-3 km)</SelectItem>
                <SelectItem value="far">Far (&gt;3 km)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Issues Grid */}
        {filteredIssues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0 relative">
                  <img
                    src={getCategoryImage(issue.category, issue.title, issue.image) || "/placeholder.svg"}
                    alt={issue.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {/* Actions Menu */}
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/issue/${issue.id}`} className="cursor-pointer">
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {issue.reportedBy !== currentUser && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Flag className="h-4 w-4 mr-2 text-red-500" />
                                Flag as Spam
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Flag Issue as Spam</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to flag "{issue.title}" as spam? This action will help our
                                  moderators review potentially inappropriate content.
                                  {issue.spamReports && issue.spamReports.length > 0 && (
                                    <div className="mt-2 text-sm text-orange-600">
                                      This issue has already been flagged {issue.spamReports.length} time(s).
                                    </div>
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleFlagAsSpam(issue.id, issue.title)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Flag as Spam
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {/* Spam indicator */}
                  {issue.spamReports && issue.spamReports.length > 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="destructive" className="text-xs">
                        {issue.spamReports.length} spam report{issue.spamReports.length > 1 ? "s" : ""}
                      </Badge>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/issue/${issue.id}`}>
                      <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">{issue.title}</h3>
                    </Link>
                    <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{issue.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="truncate flex-1">{issue.address}</span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-2 p-1 h-auto">
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
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-1 text-blue-500" />
                        <span className="text-primary-600 font-medium">{issue.category}</span>
                      </div>
                      {issue.reportedBy && (
                        <div className="flex items-center text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          <span className="text-xs">by {issue.reportedBy}</span>
                        </div>
                      )}
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
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all" || distanceFilter !== "all"
                ? "No matching issues found"
                : "No issues reported yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all" || distanceFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Be the first to report a civic issue and help improve your community."}
            </p>
            <Link href="/report">
              <Button className="bg-primary hover:bg-primary-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Report First Issue
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
