"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Navigation, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapView } from "@/components/map-view"
import { appStore } from "@/lib/store"
import { toast } from "sonner"

export default function MapPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [issue, setIssue] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const issueId = searchParams.get("issueId")
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const address = searchParams.get("address")

  useEffect(() => {
    if (issueId) {
      const foundIssue = appStore.getIssue(issueId)
      setIssue(foundIssue)
    }
    setLoading(false)
  }, [issueId])

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: issue?.title || "Civic Issue Location",
          text: `Check out this civic issue: ${issue?.title || "Issue"}`,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      toast.success("Location URL copied to clipboard!")
    }
  }

  const handleGetDirections = () => {
    if (lat && lng) {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      window.open(googleMapsUrl, "_blank")
    } else {
      toast.error("Location coordinates not available")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  const coordinates = lat && lng ? { lat: Number.parseFloat(lat), lng: Number.parseFloat(lng) } : issue?.coordinates
  const displayAddress = address ? decodeURIComponent(address) : issue?.address || "Unknown location"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Issue Location</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm" onClick={handleGetDirections}>
                <Navigation className="h-4 w-4 mr-2" />
                Directions
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Location Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <MapView
                  coordinates={coordinates}
                  address={displayAddress}
                  className="h-96 lg:h-[500px] rounded-b-lg"
                />
              </CardContent>
            </Card>

            {/* Address Details */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Address Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Address</label>
                    <p className="text-gray-900">{displayAddress}</p>
                  </div>
                  {coordinates && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Latitude</label>
                        <p className="text-gray-900 font-mono">{coordinates.lat.toFixed(6)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Longitude</label>
                        <p className="text-gray-900 font-mono">{coordinates.lng.toFixed(6)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Issue Details Sidebar */}
          <div className="lg:col-span-1">
            {issue ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{issue.title}</CardTitle>
                    <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-900 text-sm mt-1">{issue.description}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="text-primary-600 font-medium">{issue.category}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Reported Date</label>
                      <p className="text-gray-900 text-sm">{issue.reportedDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Distance</label>
                      <p className="text-gray-900 text-sm">{issue.distance} km</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Link href={`/issue/${issue.id}`}>
                      <Button className="w-full">View Full Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Location Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Viewing location on map</p>
                    <p className="text-sm text-gray-500 mt-2">{displayAddress}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleGetDirections}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Location
                </Button>
                <Link href="/report" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MapPin className="h-4 w-4 mr-2" />
                    Report Issue Here
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
