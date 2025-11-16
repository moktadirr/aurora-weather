"use client"

import { useEffect, useState, useRef } from "react"
import type { Location } from "@/types/weather"

// Define the props interface
interface MapComponentProps {
  location: Location
  layerType: string
}

export default function MapComponent({ location, layerType }: MapComponentProps) {
  const [map, setMap] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletRef = useRef<any>(null)

  useEffect(() => {
    const loadLeafletFromCDN = () => {
      return new Promise((resolve, reject) => {
        // Check if Leaflet is already loaded
        if (typeof window !== "undefined" && (window as any).L) {
          leafletRef.current = (window as any).L
          resolve((window as any).L)
          return
        }

        // Load Leaflet CSS
        const cssLink = document.createElement("link")
        cssLink.rel = "stylesheet"
        cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        cssLink.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        cssLink.crossOrigin = "anonymous"
        document.head.appendChild(cssLink)

        // Load Leaflet JavaScript
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        script.crossOrigin = "anonymous"

        script.onload = () => {
          if ((window as any).L) {
            leafletRef.current = (window as any).L
            resolve((window as any).L)
          } else {
            reject(new Error("Leaflet failed to load"))
          }
        }

        script.onerror = () => {
          reject(new Error("Failed to load Leaflet script"))
        }

        document.head.appendChild(script)
      })
    }

    const initializeMap = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const L = await loadLeafletFromCDN()

        await new Promise(resolve => setTimeout(resolve, 100))

        if (!mapRef.current) {
          throw new Error("Map container not found")
        }

        if (mapRef.current.offsetHeight === 0 || mapRef.current.offsetWidth === 0) {
          throw new Error("Map container has zero dimensions")
        }

        // Initialize the map
        const mapInstance = L.map(mapRef.current).setView([location.lat, location.lon], 8)

        // Add the base tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapInstance)

        // Create a marker for the location
        const icon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })

        const marker = L.marker([location.lat, location.lon], { icon }).addTo(mapInstance)
        marker.bindPopup(`${location.name}, ${location.country}`).openPopup()

        setMap(mapInstance)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to initialize map:", error)
        setError("Failed to load interactive map")
        setIsLoading(false)
      }
    }

    initializeMap()

    // Cleanup function
    return () => {
      if (map) {
        try {
          map.remove()
        } catch (e) {
          console.warn("Error cleaning up map:", e)
        }
        setMap(null)
      }
    }
  }, []) // Only run once on mount

  // Update map view when location changes
  useEffect(() => {
    if (map && leafletRef.current) {
      try {
        map.setView([location.lat, location.lon], 8)

        // Update marker position
        map.eachLayer((layer: any) => {
          if (layer instanceof leafletRef.current.Marker) {
            map.removeLayer(layer)
          }
        })

        const icon = leafletRef.current.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })

        const marker = leafletRef.current.marker([location.lat, location.lon], { icon }).addTo(map)
        marker.bindPopup(`${location.name}, ${location.country}`).openPopup()
      } catch (error) {
        console.error("Error updating map location:", error)
      }
    }
  }, [location, map])

  // Update weather layer when layerType changes
  useEffect(() => {
    if (map && leafletRef.current) {
      try {
        // Remove any existing weather layers
        map.eachLayer((layer: any) => {
          if (layer instanceof leafletRef.current.TileLayer && layer.options.attribution?.includes("OpenWeatherMap")) {
            map.removeLayer(layer)
          }
        })

        // Add the new weather layer (using a demo API key - users should replace with their own)
        const apiKey = "626d7a8b8a2b8a7b0b6b7b8a7b0b6b7b" // Placeholder API key
        const weatherLayer = leafletRef.current.tileLayer(
          `https://tile.openweathermap.org/map/${layerType}/{z}/{x}/{y}.png?appid=${apiKey}`,
          {
            attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
            maxZoom: 19,
            opacity: 0.6,
          },
        )

        weatherLayer.addTo(map)
      } catch (error) {
        console.error("Error updating weather layer:", error)
      }
    }
  }, [layerType, map])

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background/50 rounded-lg border border-border/50">
        <div className="text-center p-4">
          <p className="text-sm text-muted-foreground mb-2">Map unavailable</p>
          <p className="text-xs text-muted-foreground/70">{error}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background/50 rounded-lg border border-border/50">
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="h-full w-full rounded-lg overflow-hidden bg-background/30"></div>
}
