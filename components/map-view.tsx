"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface MapViewProps {
  coordinates: [number, number]
  address: string
  className?: string
}

export function MapView({ coordinates, address, className }: MapViewProps) {
  const [imageError, setImageError] = useState(false)

  // Create a static map URL (using a placeholder service)
  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-l+000(${coordinates[1]},${coordinates[0]})/${coordinates[1]},${coordinates[0]},14/400x300@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`

  if (imageError) {
    return (
      <div className={cn("bg-gray-100 rounded-lg flex items-center justify-center", className)}>
        <div className="text-center p-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 font-medium">{address}</p>
          <p className="text-sm text-gray-500 mt-1">
            {coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative rounded-lg overflow-hidden", className)}>
      <img
        src={mapUrl || "/placeholder.svg"}
        alt={`Map showing ${address}`}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm truncate">{address}</span>
        </div>
      </div>
    </div>
  )
}
