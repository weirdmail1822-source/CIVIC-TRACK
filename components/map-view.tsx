"use client"

import { MapPin } from "lucide-react"

interface MapViewProps {
  coordinates?: { lat: number; lng: number }
  address: string
  className?: string
}

export function MapView({ coordinates, address, className = "h-48" }: MapViewProps) {
  return (
    <div className={`bg-secondary-100 rounded-lg flex items-center justify-center ${className}`}>
      <div className="text-center text-gray-600">
        <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
        <p className="text-sm font-medium mb-1">Location</p>
        <p className="text-xs text-gray-500">{address}</p>
        {coordinates && (
          <p className="text-xs text-gray-400 mt-1">
            {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-2">Interactive map would load here</p>
      </div>
    </div>
  )
}
