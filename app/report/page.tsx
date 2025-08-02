"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, MapPin, Camera, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { appStore } from "@/lib/store"
import { toast } from "sonner"

export default function ReportPage() {
  const [username, setUsername] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    address: "",
    image: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
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
    }

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          toast.success("Location detected automatically")
        },
        (error) => {
          console.error("Error getting location:", error)
          toast.error("Could not detect location. Please enter address manually.")
        },
      )
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("username")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate form
    if (!formData.title || !formData.description || !formData.category || !formData.address) {
      toast.error("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create new issue
    const newIssue = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      address: formData.address,
      reportedDate: new Date().toISOString().split("T")[0],
      reportedTime: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      reportedBy: username,
      status: "Reported",
      distance: location ? "0.1" : "1.0", // Mock distance
      image: formData.image || `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(formData.title)}`,
      coordinates: location || { lat: 40.7128, lng: -74.006 }, // Default to NYC if no location
    }

    const createdIssue = appStore.addIssue(newIssue)

    toast.success("Issue reported successfully!")
    router.push(`/issue/${createdIssue.id}`)

    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload to a server
      // For now, we'll just use a placeholder
      const imageUrl = `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(file.name)}`
      setFormData({
        ...formData,
        image: imageUrl,
      })
      toast.success("Image uploaded successfully")
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
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-6 w-6 mr-2 text-primary" />
              Report New Issue
            </CardTitle>
            <CardDescription>Help improve your community by reporting civic issues that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Title *
                </label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Brief description of the issue"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Roads">Roads (potholes, cracks, obstructions)</SelectItem>
                    <SelectItem value="Lighting">Lighting (broken or flickering lights)</SelectItem>
                    <SelectItem value="Water Supply">Water Supply (leaks, low pressure)</SelectItem>
                    <SelectItem value="Cleanliness">Cleanliness (overflowing bins, garbage)</SelectItem>
                    <SelectItem value="Public Safety">Public Safety (open manholes, exposed wiring)</SelectItem>
                    <SelectItem value="Obstructions">Obstructions (fallen trees, debris)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide detailed description of the issue, including any safety concerns or urgency"
                  rows={4}
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Location/Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder={
                      location ? "Location detected - enter specific address" : "Enter the exact location of the issue"
                    }
                    className="pl-10"
                  />
                </div>
                {location && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ GPS coordinates detected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Photo (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-700"
                    />
                  </div>
                  <Camera className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Adding a photo helps authorities understand and prioritize the issue
                </p>
              </div>

              <div className="bg-secondary-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Before submitting:</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Ensure the issue hasn't already been reported</li>
                  <li>• Provide accurate location information</li>
                  <li>• Include relevant details that help prioritize the issue</li>
                  <li>• Avoid reporting emergency situations (call emergency services instead)</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Report"}
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="outline" className="px-8 bg-transparent">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
