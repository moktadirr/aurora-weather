"use client"

import { useState } from "react"
import { MapIcon, Info, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Location } from "@/types/weather"

interface WeatherMapFallbackProps {
  location: Location
}

export function WeatherMapFallback({ location }: WeatherMapFallbackProps) {
  const [activeLayer, setActiveLayer] = useState<string>("temp_new")

  // Map layers available from OpenWeatherMap
  const mapLayers = [
    { id: "temp_new", name: "Temperature", color: "text-red-500" },
    { id: "precipitation_new", name: "Precipitation", color: "text-blue-500" },
    { id: "clouds_new", name: "Clouds", color: "text-gray-500" },
    { id: "wind_new", name: "Wind", color: "text-cyan-500" },
    { id: "pressure_new", name: "Pressure", color: "text-purple-500" },
  ]

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
                <p>Weather patterns visualization</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="temp_new" value={activeLayer} onValueChange={setActiveLayer} className="w-full">
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

            {mapLayers.map((layer) => (
              <TabsContent key={layer.id} value={layer.id} className="mt-0">
                <div className="relative w-full h-[300px] rounded-lg overflow-hidden bg-background/50">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-background/10">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-full h-full">
                          {/* Simulated map background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-300/10 to-slate-500/10 opacity-30"></div>

                          {/* Location marker */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="relative">
                              <MapPin className="h-8 w-8 text-primary" />
                              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-background/80 px-2 py-1 rounded text-xs">
                                {location.name}, {location.country}
                              </div>
                            </div>
                          </div>

                          {/* Weather layer visualization (simulated) */}
                          <div className="absolute inset-0">
                            {activeLayer === "temp_new" && (
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-yellow-500/20 to-red-500/20"></div>
                            )}
                            {activeLayer === "precipitation_new" && (
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-blue-700/10"></div>
                            )}
                            {activeLayer === "clouds_new" && (
                              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-gray-700/10"></div>
                            )}
                            {activeLayer === "wind_new" && (
                              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/10"></div>
                            )}
                            {activeLayer === "pressure_new" && (
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/10"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-3 text-sm text-center text-muted-foreground">
                  {layer.name} map for {location.name}, {location.country}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
