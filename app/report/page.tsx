"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Camera, Send, Loader2, CheckCircle } from "lucide-react"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    address: "",
    images: [] as File[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const { currentUser, addIssue } = useStore()
  const router = useRouter()

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

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
    }
  }, [currentUser, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }))
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const detectLocation = () => {
    setIsDetectingLocation(true)

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Simulate reverse geocoding
            const mockAddresses = [
              "123 Main Street, Downtown",
              "456 Oak Avenue, Midtown",
              "789 Pine Road, Uptown",
              "321 Elm Street, Westside",
              "654 Maple Drive, Eastside",
            ]

            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1500))

            const randomAddress = mockAddresses[Math.floor(Math.random() * mockAddresses.length)]
            handleInputChange("address", randomAddress)
          } catch (err) {
            setError("Failed to get address from location")
          } finally {
            setIsDetectingLocation(false)
          }
        },
        (error) => {
          setError("Unable to detect location. Please enter address manually.")
          setIsDetectingLocation(false)
        },
      )
    } else {
      setError("Geolocation is not supported by this browser")
      setIsDetectingLocation(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.title.trim()) {
      setError("Please enter a title")
      return
    }

    if (!formData.description.trim()) {
      setError("Please enter a description")
      return
    }

    if (!formData.category) {
      setError("Please select a category")
      return
    }

    if (!formData.address.trim()) {
      setError("Please enter an address")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newIssue = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        address: formData.address,
        images: formData.images.map((file) => URL.createObjectURL(file)),
        reporterId: currentUser!.id,
        reporterName: currentUser!.name,
      }

      addIssue(newIssue)
      setIsSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          category: "",
          address: "",
          images: [],
        })
        setIsSuccess(false)
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError("Failed to submit issue. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!currentUser) {
    return null
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#b4a7d6] to-[#674ea7] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-white/20 text-center">
          <CardContent className="pt-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#674ea7] mb-2">Issue Reported!</h2>
            <p className="text-gray-600 mb-4">
              Your issue has been successfully submitted and will be reviewed by the authorities.
            </p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b4a7d6] to-[#674ea7] p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl font-bold text-white mb-2">Report an Issue</h1>
          <p className="text-white/90">Help improve your community by reporting civic issues</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-[#674ea7]">Issue Details</CardTitle>
            <CardDescription>Provide detailed information about the issue you want to report</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Issue Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="border-[#b4a7d6]/20 focus:border-[#674ea7]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="border-[#b4a7d6]/20 focus:border-[#674ea7]">
                    <SelectValue placeholder="Select issue category" />
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
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed description of the issue..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  className="border-[#b4a7d6]/20 focus:border-[#674ea7]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Location *</Label>
                <div className="flex gap-2">
                  <Input
                    id="address"
                    placeholder="Enter the address or location"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="flex-1 border-[#b4a7d6]/20 focus:border-[#674ea7]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={detectLocation}
                    disabled={isDetectingLocation}
                    className="border-[#b4a7d6] text-[#674ea7] hover:bg-[#b4a7d6]/10 bg-transparent"
                  >
                    {isDetectingLocation ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {isDetectingLocation && <p className="text-sm text-gray-500">Detecting your location...</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Images (Optional)</Label>
                <div className="border-2 border-dashed border-[#b4a7d6]/30 rounded-lg p-6 text-center">
                  <Camera className="mx-auto h-12 w-12 text-[#b4a7d6] mb-4" />
                  <div className="space-y-2">
                    <Label htmlFor="images" className="cursor-pointer">
                      <span className="text-[#674ea7] hover:underline">Click to upload images</span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </Label>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full bg-[#674ea7] hover:bg-[#674ea7]/90" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Issue...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Issue
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
