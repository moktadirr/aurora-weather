"use client"

import { useState, useEffect } from "react"
import type { Location } from "@/types/weather"
import { InteractiveWeatherMap } from "./interactive-weather-map"
import { WeatherMapFallback } from "./weather-map-fallback"

interface WeatherMapProps {
  location: Location
}

export function WeatherMap({ location }: WeatherMapProps) {
  const [useInteractiveMap, setUseInteractiveMap] = useState(true)

  useEffect(() => {
    // Check if we can use the interactive map
    const checkMapSupport = async () => {
      try {
        // Try to dynamically import leaflet
        await import("leaflet")
        setUseInteractiveMap(true)
      } catch (error) {
        console.error("Leaflet import failed, using fallback map:", error)
        setUseInteractiveMap(false)
      }
    }

    checkMapSupport()
  }, [])

  return useInteractiveMap ? <InteractiveWeatherMap location={location} /> : <WeatherMapFallback location={location} />
}
