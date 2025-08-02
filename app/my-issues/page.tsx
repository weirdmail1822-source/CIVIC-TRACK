"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, MapPin, Calendar, Tag, AlertCircle, Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { appStore } from "@/lib/store"

export default function MyIssuesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [issues, setIssues] = useState<any[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState("")
  const router = useRouter()

  useEffect(() => {
    const authenticated = localStorage.getItem("isAuthenticated")
    const username = localStorage.getItem("username")

    if (!authenticated) {
      router.push("/login")
      return
    }

    setIsAuthenticated(true)
    setCurrentUser(username || "")

    // Filter issues by current user
    const allIssues = appStore.getIssues()
    const userIssues = allIssues.filter((issue) => issue.reportedBy === username)
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
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center">
                <AlertCircle className="h-8 w-8 text-primary mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">CIVIC TRACK</h1>
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-600 hover:text-primary">
                  Home
                </Link>
                <Link href="/my-issues" className="text-primary font-medium">
                  My Issues
                </Link>
                <Link href="/report" className="text-gray-600 hover:text-primary">
                  Report Issue
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {currentUser}</span>
              <Button
                onClick={() => {
                  localStorage.clear()
                  router.push("/")
                }}
                variant="outline"
                size="sm"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Issues</h1>
            <p className="text-gray-600 mt-2">Track and manage your reported civic issues</p>
          </div>
          <Link href="/report">
            <Button className="bg-primary hover:bg-primary-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Report New Issue
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Issues Grid */}
        {filteredIssues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <img
                    src={issue.image || "/placeholder.svg?height=200&width=300&text=Issue+Image"}
                    alt={issue.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
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
                      <span className="truncate">{issue.address}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{issue.reportedDate}</span>
                      </div>
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        <span>{issue.category}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "You haven't reported any issues yet."}
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
