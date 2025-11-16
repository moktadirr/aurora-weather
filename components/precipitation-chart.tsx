"use client"

import { motion } from "framer-motion"
import { Umbrella, Info, CloudRain } from 'lucide-react'
import type { Hour } from "@/types/weather"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PrecipitationChartProps {
  hours: Hour[]
  timeFormat: "12h" | "24h"
}

export function PrecipitationChart({ hours, timeFormat }: PrecipitationChartProps) {
  if (!hours || !Array.isArray(hours) || hours.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-md border-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Umbrella className="h-5 w-5 text-blue-500" />
            Precipitation Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-center py-8">No precipitation data available</div>
        </CardContent>
      </Card>
    )
  }

  // Filter hours to only show future hours from current time
  const currentTime = new Date()
  const futureHours = hours
    .filter((hour) => {
      const hourTime = new Date(hour.time)
      return hourTime > currentTime
    })
    .slice(0, 12) // Show next 12 hours

  if (futureHours.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-md border-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Umbrella className="h-5 w-5 text-blue-500" />
            Precipitation Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-center py-8">No precipitation data available for the next 12 hours</div>
        </CardContent>
      </Card>
    )
  }

  const maxPrecipitation = Math.max(...futureHours.map((hour) => hour.precip_mm || 0), 1)

  // Calculate total precipitation for the period
  const totalPrecipitation = futureHours.reduce((sum, hour) => sum + (hour.precip_mm || 0), 0)

  // Determine if there's any significant precipitation
  const hasPrecipitation = totalPrecipitation > 0.1

  const maxRainChanceHour = futureHours.reduce(
    (max, hour) => {
      const currentChance = hour.chance_of_rain || 0
      const maxChance = max.chance_of_rain || 0
      return currentChance > maxChance ? hour : max
    },
    futureHours[0],
  )

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    if (timeFormat === "24h") {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    }
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <TooltipProvider>
      <Card className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-md border-muted/30 relative group">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Umbrella className="h-5 w-5 text-blue-500" />
            Precipitation Forecast
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Precipitation forecast for the next 12 hours</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Precipitation summary */}
          <div className="mb-4 p-3 rounded-lg bg-background/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Total Precipitation:</span>
              <span className="text-sm font-bold">{totalPrecipitation.toFixed(1)} mm</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Highest Chance:</span>
              <span className="text-sm font-bold">
                {maxRainChanceHour?.chance_of_rain || 0}% at {formatTime(maxRainChanceHour?.time || "")}
              </span>
            </div>
            {hasPrecipitation ? (
              <div className="mt-2 text-sm text-blue-500 flex items-center gap-1">
                <CloudRain className="h-4 w-4" />
                <span>Precipitation expected in the next 12 hours</span>
              </div>
            ) : (
              <div className="mt-2 text-sm text-muted-foreground">No significant precipitation expected</div>
            )}
          </div>

          <div className="h-[160px] flex items-end justify-between gap-1">
            {futureHours.map((hour, index) => {
              const height = hour.precip_mm > 0 ? Math.max(15, (hour.precip_mm / maxPrecipitation) * 100) : 0

              return (
                <motion.div
                  key={hour.time_epoch}
                  className="relative flex flex-col items-center flex-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute top-0 w-full text-center cursor-help">
                        <span className="text-xs font-medium">{hour.chance_of_rain || 0}%</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {hour.chance_of_rain || 0}% chance of rain at {formatTime(hour.time)}
                      </p>
                      {hour.precip_mm > 0 && <p>{hour.precip_mm} mm expected</p>}
                    </TooltipContent>
                  </Tooltip>

                  <div className="h-full flex items-end justify-center w-full pt-6 pb-6">
                    <motion.div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm opacity-80"
                      style={{ height: `${height}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      {hour.precip_mm > 0 && (
                        <div className="w-full text-center text-xs font-medium text-white mt-1">
                          {hour.precip_mm} mm
                        </div>
                      )}
                    </motion.div>
                  </div>
                  <div className="text-xs text-muted-foreground">{formatTime(hour.time)}</div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
