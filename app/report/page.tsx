"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, Upload, X, LogOut, User, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { appStore } from "@/lib/store"

export default function ReportPage() {
  const [username, setUsername] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    address: "",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const router = useRouter()

  const detectLocation = () => {
    setIsDetectingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setLocation(coords)
          // Mock reverse geocoding
          setFormData({
            ...formData,
            address: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)} (Auto-detected)`,
          })
          setIsDetectingLocation(false)
        },
        (error) => {
          console.error("Error detecting location:", error)
          setIsDetectingLocation(false)
          alert("Unable to detect location. Please enter address manually.")
        },
      )
    } else {
      setIsDetectingLocation(false)
      alert("Geolocation is not supported by this browser.")
    }
  }

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
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("username")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    router.push("/")
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const getCategoryImage = (category: string) => {
    const categoryImages = {
      Roads: "/placeholder.svg?height=200&width=300&text=Road+Issue",
      Lighting: "/placeholder.svg?height=200&width=300&text=Street+Light",
      "Water Supply": "/placeholder.svg?height=200&width=300&text=Water+Leak",
      Cleanliness: "/placeholder.svg?height=200&width=300&text=Garbage+Issue",
      "Public Safety": "/placeholder.svg?height=200&width=300&text=Safety+Hazard",
      Obstructions: "/placeholder.svg?height=200&width=300&text=Obstruction",
    }
    return categoryImages[category as keyof typeof categoryImages] || "/placeholder.svg?height=200&width=300&text=Issue"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Calculate random distance for demo
    const distance = (Math.random() * 5).toFixed(1)

    const newIssue = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: "Reported",
      address: formData.address,
      reportedDate: new Date().toISOString().split("T")[0],
      reportedTime: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
      reportedBy: username,
      distance,
      image: getCategoryImage(formData.category),
      coordinates: location,
    }

    // Add to store
    appStore.addIssue(newIssue)

    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Report New Issue</CardTitle>
            <CardDescription>Help improve your community by reporting civic issues</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Upload Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide detailed information about the issue..."
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Roads">Roads (potholes, obstructions)</SelectItem>
                    <SelectItem value="Lighting">Lighting (broken or flickering lights)</SelectItem>
                    <SelectItem value="Water Supply">Water Supply (leaks, low pressure)</SelectItem>
                    <SelectItem value="Cleanliness">Cleanliness (overflowing bins, garbage)</SelectItem>
                    <SelectItem value="Public Safety">Public Safety (open manholes, exposed wiring)</SelectItem>
                    <SelectItem value="Obstructions">Obstructions (fallen trees, debris)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address/Location</Label>
                <div className="flex gap-2">
                  <Input
                    id="address"
                    name="address"
                    placeholder="Where is this issue located?"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={detectLocation}
                    disabled={isDetectingLocation}
                    className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    {isDetectingLocation ? "Detecting..." : "Auto-Detect"}
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting Issue..." : "Submit Issue"}
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="outline">
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
