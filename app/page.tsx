"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, MapPin, Calendar, Tag, AlertCircle, Map, User, LogOut } from "lucide-react"
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
import { appStore } from "@/lib/store"
import { MapView } from "@/components/map-view"
import { useRouter } from "next/navigation"

const getCategoryImage = (category: string, title: string) => {
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

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [distanceFilter, setDistanceFilter] = useState("all")
  const [issues, setIssues] = useState<any[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState("")
  const router = useRouter()

  useEffect(() => {
    setIssues(appStore.getIssues())

    // Check authentication status
    const authenticated = localStorage.getItem("isAuthenticated")
    const username = localStorage.getItem("username")

    if (authenticated) {
      setIsAuthenticated(true)
      setCurrentUser(username || "")
    }
  }, [])

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter

    // Fix distance filtering
    let matchesDistance = true
    if (distanceFilter !== "all") {
      const issueDistance = Number.parseFloat(issue.distance)
      switch (distanceFilter) {
        case "1km":
          matchesDistance = issueDistance <= 1
          break
        case "3km":
          matchesDistance = issueDistance <= 3
          break
        case "5km":
          matchesDistance = issueDistance <= 5
          break
      }
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesDistance
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

  const handleLogout = () => {
    localStorage.clear()
    setIsAuthenticated(false)
    setCurrentUser("")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-secondary-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center">
                <AlertCircle className="h-8 w-8 text-primary mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">CIVIC TRACK</h1>
              </Link>

              {isAuthenticated && (
                <div className="hidden md:flex space-x-6">
                  <Link href="/" className="text-primary font-medium">
                    Home
                  </Link>
                  <Link href="/my-issues" className="text-gray-600 hover:text-primary">
                    My Issues
                  </Link>
                  <Link href="/report" className="text-gray-600 hover:text-primary">
                    Report Issue
                  </Link>
                </div>
              )}
            </div>

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message for Authenticated Users */}
        {isAuthenticated && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-primary-800">Welcome back, {currentUser}!</h2>
                <p className="text-primary-600">Track civic issues in your community and report new ones.</p>
              </div>
              <div className="flex space-x-3">
                <Link href="/my-issues">
                  <Button variant="outline" size="sm">
                    My Issues
                  </Button>
                </Link>
                <Link href="/report">
                  <Button className="bg-primary hover:bg-primary-700 text-white" size="sm">
                    Report Issue
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <SelectValue placeholder="Category" />
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
                <SelectValue placeholder="Status" />
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
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Distances</SelectItem>
                <SelectItem value="1km">Within 1km</SelectItem>
                <SelectItem value="3km">Within 3km</SelectItem>
                <SelectItem value="5km">Within 5km</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <Card key={issue.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="p-0">
                <img
                  src={getCategoryImage(issue.category, issue.title) || "/placeholder.svg"}
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

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
