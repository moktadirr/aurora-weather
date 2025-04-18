"use client"

import { useState, useEffect } from "react"
import { MapIcon, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import type { Location } from "@/types/weather"
import dynamic from "next/dynamic"
import { trackEvent } from "@/utils/analytics"

// Dynamically import the Map component with no SSR
const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] flex items-center justify-center bg-background/50 rounded-lg">
      <Skeleton className="w-full h-full rounded-lg" />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
})

interface InteractiveWeatherMapProps {
  location: Location
}

export function InteractiveWeatherMap({ location }: InteractiveWeatherMapProps) {
  const [activeLayer, setActiveLayer] = useState<string>("temp_new")
  const [isMounted, setIsMounted] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  // Map layers available from OpenWeatherMap
  const mapLayers = [
    { id: "temp_new", name: "Temperature", color: "text-red-500" },
    { id: "precipitation_new", name: "Precipitation", color: "text-blue-500" },
    { id: "clouds_new", name: "Clouds", color: "text-gray-500" },
    { id: "wind_new", name: "Wind", color: "text-cyan-500" },
    { id: "pressure_new", name: "Pressure", color: "text-purple-500" },
  ]

  // Only render the map component on the client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <TooltipProvider>
      <Card className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-md border-muted/30 relative group">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <MapIcon className="h-5 w-5 text-primary" />
            Weather Map
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Interactive weather map showing different weather patterns</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="temp_new"
            value={activeLayer}
            onValueChange={(value) => {
              setActiveLayer(value)

              // Track layer change
              try {
                trackEvent("toggle_map_layer", {
                  layer: value,
                  location: `${location.name}, ${location.country}`,
                })
              } catch (error) {
                console.error("Error tracking event:", error)
              }
            }}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 mb-4">
              {mapLayers.map((layer) => (
                <TabsTrigger
                  key={layer.id}
                  value={layer.id}
                  className={`flex items-center gap-1 ${activeLayer === layer.id ? layer.color : ""}`}
                >
                  <span className="hidden sm:inline">{layer.name}</span>
                  <span className="sm:hidden">{layer.name.charAt(0)}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="w-full h-[300px] rounded-lg overflow-hidden">
              {isMounted && !mapError && (
                <div className="h-full w-full">
                  <MapComponent location={location} layerType={activeLayer} />
                </div>
              )}

              {mapError && (
                <div className="w-full h-full flex items-center justify-center bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Unable to load map: {mapError}</p>
                </div>
              )}
            </div>

            <div className="mt-3 text-sm text-center text-muted-foreground">
              {mapLayers.find((l) => l.id === activeLayer)?.name} map for {location.name}, {location.country}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
