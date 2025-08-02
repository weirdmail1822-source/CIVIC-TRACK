"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin } from "lucide-react"
import { MapView } from "@/components/map-view"

export default function MapPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const issueId = searchParams.get("issueId")
  const lat = Number.parseFloat(searchParams.get("lat") || "0")
  const lng = Number.parseFloat(searchParams.get("lng") || "0")
  const address = searchParams.get("address") || ""

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Issue Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Address:</p>
                  <p className="font-medium">{decodeURIComponent(address)}</p>
                </div>

                {lat !== 0 && lng !== 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Coordinates:</p>
                    <p className="font-mono text-sm">
                      {lat.toFixed(6)}, {lng.toFixed(6)}
                    </p>
                  </div>
                )}

                <MapView coordinates={{ lat, lng }} address={decodeURIComponent(address)} className="h-96" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
