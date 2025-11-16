"use client"

import { motion } from "framer-motion"
import { Thermometer, Info } from "lucide-react"
import type { Hour } from "@/types/weather"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEffect, useState } from "react"

interface TemperatureChartProps {
  hours: Hour[]
  timeFormat: "12h" | "24h"
  temperatureUnit: "celsius" | "fahrenheit"
}

export function TemperatureChart({ hours, timeFormat, temperatureUnit }: TemperatureChartProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (!hours || !Array.isArray(hours) || hours.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-md border-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-red-500" />
            Temperature Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            No temperature data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentTime = new Date()
  const validHours = hours
    .filter((hour) => {
      // Check if hour exists and has required temperature properties
      if (!hour || typeof hour.temp_c !== "number" || typeof hour.temp_f !== "number") {
        return false
      }
      const hourTime = new Date(hour.time)
      return hourTime > currentTime
    })
    .slice(0, 12) // Show next 12 hours

  if (validHours.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-md border-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-red-500" />
            Temperature Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            No future temperature data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const getTemp = (hour: Hour) => {
    if (!hour) return 0
    const temp = temperatureUnit === "celsius" ? hour.temp_c : hour.temp_f
    return typeof temp === "number" ? temp : 0
  }

  const temperatures = validHours.map((hour) => getTemp(hour))
  const minTemp = Math.min(...temperatures) - 2
  const maxTemp = Math.max(...temperatures) + 2
  const tempRange = maxTemp - minTemp || 1 // Prevent division by zero

  const formatTime = (timeString: string) => {
    try {
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
    } catch {
      return "N/A"
    }
  }

  return (
    <TooltipProvider>
      <Card className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-md border-muted/30 relative group">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-red-500" />
            Temperature Forecast
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Temperature forecast for the next {validHours.length} hours</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] relative">
            {/* Temperature gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 via-yellow-500/10 to-blue-500/10 rounded-md"></div>

            {/* Temperature lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-6">
              <div className="h-px bg-muted/20 relative">
                <span className="absolute -top-3 right-0 text-xs text-muted-foreground">
                  {Math.round(maxTemp)}°{temperatureUnit === "celsius" ? "C" : "F"}
                </span>
              </div>
              <div className="h-px bg-muted/20 relative">
                <span className="absolute -top-3 right-0 text-xs text-muted-foreground">
                  {Math.round(minTemp + tempRange * 0.75)}°
                </span>
              </div>
              <div className="h-px bg-muted/20 relative">
                <span className="absolute -top-3 right-0 text-xs text-muted-foreground">
                  {Math.round(minTemp + tempRange * 0.5)}°
                </span>
              </div>
              <div className="h-px bg-muted/20 relative">
                <span className="absolute -top-3 right-0 text-xs text-muted-foreground">
                  {Math.round(minTemp + tempRange * 0.25)}°
                </span>
              </div>
              <div className="h-px bg-muted/20 relative">
                <span className="absolute -top-3 right-0 text-xs text-muted-foreground">
                  {Math.round(minTemp)}°{temperatureUnit === "celsius" ? "C" : "F"}
                </span>
              </div>
            </div>

            {/* Temperature chart */}
            <div className="absolute inset-0 flex items-end pt-6 pb-8">
              <svg className="w-full h-full" viewBox={`0 0 ${validHours.length - 1} 1`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="rgb(234, 179, 8)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                {validHours.length > 1 && (
                  <motion.path
                    d={`M 0,${1 - (getTemp(validHours[0]) - minTemp) / tempRange} ${validHours
                      .slice(1)
                      .map((hour, i) => {
                        return `L ${i + 1},${1 - (getTemp(hour) - minTemp) / tempRange}`
                      })
                      .join(" ")}`}
                    fill="none"
                    stroke="url(#tempGradient)"
                    strokeWidth="0.02"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                )}
              </svg>
            </div>

            {/* Temperature points and labels */}
            <div className="absolute inset-0 flex justify-between pt-6 pb-8">
              {validHours.map((hour, index) => {
                const temp = getTemp(hour)
                const yPosition = 1 - (temp - minTemp) / tempRange

                const showLabel = index % 2 === 0 || !isMobile

                return (
                  <div key={hour.time_epoch || index} className="flex flex-col items-center justify-between h-full">
                    <motion.div
                      className="relative"
                      style={{ top: `${yPosition * 100}%` }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                    >
                      <div className="absolute -translate-y-1/2 flex flex-col items-center">
                        {showLabel && <span className="text-xs font-medium">{Math.round(temp)}°</span>}
                        <div className="h-2 w-2 rounded-full bg-primary mt-1"></div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="text-xs text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                    >
                      {showLabel ? formatTime(hour.time) : ""}
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
