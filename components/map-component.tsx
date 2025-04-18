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
  const [leaflet, setLeaflet] = useState<any>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Dynamically import leaflet only on the client side
    const loadLeaflet = async () => {
      try {
        // Import leaflet and its CSS
        const L = await import("leaflet")
        await import("leaflet/dist/leaflet.css")

        setLeaflet(L)

        // Initialize the map if it doesn't exist
        if (!map && mapRef.current) {
          const mapInstance = L.map(mapRef.current).setView([location.lat, location.lon], 8)

          // Add the base tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(mapInstance)

          // Create a marker for the location
          const icon = L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
            shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          })

          const marker = L.marker([location.lat, location.lon], { icon }).addTo(mapInstance)
          marker.bindPopup(`${location.name}, ${location.country}`).openPopup()

          setMap(mapInstance)
        }
      } catch (error) {
        console.error("Failed to load Leaflet:", error)
        setError("Failed to load map library")
      }
    }

    loadLeaflet()

    // Cleanup function
    return () => {
      if (map) {
        map.remove()
        setMap(null)
      }
    }
  }, []) // Only run once on mount

  // Update map view when location changes
  useEffect(() => {
    if (map && leaflet) {
      map.setView([location.lat, location.lon], 8)

      // Update marker position
      map.eachLayer((layer: any) => {
        if (layer instanceof leaflet.Marker) {
          map.removeLayer(layer)
        }
      })

      const icon = leaflet.icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      const marker = leaflet.marker([location.lat, location.lon], { icon }).addTo(map)
      marker.bindPopup(`${location.name}, ${location.country}`).openPopup()
    }
  }, [location, map, leaflet])

  // Update weather layer when layerType changes
  useEffect(() => {
    if (map && leaflet) {
      try {
        // Remove any existing weather layers
        map.eachLayer((layer: any) => {
          if (layer instanceof leaflet.TileLayer && layer.options.attribution?.includes("OpenWeatherMap")) {
            map.removeLayer(layer)
          }
        })

        // Add the new weather layer
        const apiKey = "626d7a8b8a2b8a7b0b6b7b8a7b0b6b7b" // This is a placeholder API key
        const weatherLayer = leaflet.tileLayer(
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
  }, [layerType, map, leaflet])

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background/50">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
}
