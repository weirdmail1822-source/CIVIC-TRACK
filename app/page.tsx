"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
import { Search, MapPin, Calendar, User, Edit, Trash2, Map, Plus } from "lucide-react"
import { useStore } from "@/lib/store"
import { HeroSection, FeaturesSection, TestimonialsSection, Footer } from "@/components"

export default function Home() {
  const {
    issues,
    currentUser,
    searchTerm,
    selectedCategory,
    selectedDistance,
    setSearchTerm,
    setSelectedCategory,
    setSelectedDistance,
    updateIssue,
    deleteIssue,
  } = useStore()

  const [showMapDialog, setShowMapDialog] = useState(false)
  const [selectedIssueForMap, setSelectedIssueForMap] = useState<any>(null)
  const [editingIssue, setEditingIssue] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    address: "",
  })

  const categories = [
    "Road Maintenance",
    "Street Lighting",
    "Waste Management",
    "Water Supply",
    "Public Safety",
    "Parks & Recreation",
    "Traffic Management",
    "Noise Pollution",
  ]

  const distances = ["1KM", "3KM", "5KM"]

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || issue.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleEditIssue = (issue: any) => {
    setEditingIssue(issue)
    setEditForm({
      title: issue.title,
      description: issue.description,
      category: issue.category,
      address: issue.address,
    })
  }

  const handleSaveEdit = () => {
    if (editingIssue) {
      updateIssue(editingIssue.id, editForm)
      setEditingIssue(null)
      setEditForm({ title: "", description: "", category: "", address: "" })
    }
  }

  const handleDeleteIssue = (issueId: string) => {
    deleteIssue(issueId)
  }

  const handleMapView = (issue: any) => {
    setSelectedIssueForMap(issue)
    setShowMapDialog(true)
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#b4a7d6] to-[#674ea7]">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b4a7d6] to-[#674ea7]">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">CIVIC TRACK</h1>
            <div className="flex items-center gap-4">
              <Button asChild className="bg-white text-[#674ea7] hover:bg-gray-100">
                <a href="/report">
                  <Plus className="w-4 h-4 mr-2" />
                  Report Issue
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#674ea7] bg-transparent"
              >
                <a href="/dashboard">Dashboard</a>
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
              <Input
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-white/20 border-white/30 text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDistance} onValueChange={setSelectedDistance}>
              <SelectTrigger className="w-full md:w-32 bg-white/20 border-white/30 text-white">
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent>
                {distances.map((distance) => (
                  <SelectItem key={distance} value={distance}>
                    {distance}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <Card
              key={issue.id}
              className="bg-white/95 backdrop-blur-sm border-white/20 hover:bg-white transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-[#674ea7] text-lg mb-2">{issue.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="border-[#b4a7d6] text-[#674ea7]">
                        {issue.category}
                      </Badge>
                      <Badge
                        variant={issue.status === "resolved" ? "default" : "secondary"}
                        className={
                          issue.status === "resolved" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                        }
                      >
                        {issue.status}
                      </Badge>
                    </div>
                  </div>
                  {currentUser.id === issue.reporterId && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditIssue(issue)}
                        className="h-8 w-8 p-0 text-[#674ea7] hover:bg-[#b4a7d6]/20"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Issue</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this issue? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteIssue(issue.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">{issue.description}</CardDescription>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="flex-1">{issue.address}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMapView(issue)}
                      className="h-6 w-6 p-0 text-[#674ea7] hover:bg-[#b4a7d6]/20"
                    >
                      <Map className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(issue.reportedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{issue.reporterName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2">No issues found</h3>
              <p className="text-white/80 mb-4">Try adjusting your search criteria or report a new issue.</p>
              <Button asChild className="bg-white text-[#674ea7] hover:bg-gray-100">
                <a href="/report">
                  <Plus className="w-4 h-4 mr-2" />
                  Report New Issue
                </a>
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Edit Issue Dialog */}
      <Dialog open={!!editingIssue} onOpenChange={() => setEditingIssue(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#674ea7]">Edit Issue</DialogTitle>
            <DialogDescription>Make changes to your issue report here.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="border-[#b4a7d6]/20 focus:border-[#674ea7]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="border-[#b4a7d6]/20 focus:border-[#674ea7]"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={editForm.category}
                onValueChange={(value) => setEditForm({ ...editForm, category: value })}
              >
                <SelectTrigger className="border-[#b4a7d6]/20 focus:border-[#674ea7]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="border-[#b4a7d6]/20 focus:border-[#674ea7]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingIssue(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-[#674ea7] hover:bg-[#674ea7]/90">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Map View Dialog */}
      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-[#674ea7]">Issue Location</DialogTitle>
            <DialogDescription>
              {selectedIssueForMap?.title} - {selectedIssueForMap?.address}
            </DialogDescription>
          </DialogHeader>
          <div className="w-full h-64 bg-gradient-to-br from-[#b4a7d6] to-[#674ea7] rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <MapPin className="h-12 w-12 mx-auto mb-2" />
              <p className="font-semibold">Interactive Map</p>
              <p className="text-sm opacity-90">Location: {selectedIssueForMap?.address}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
