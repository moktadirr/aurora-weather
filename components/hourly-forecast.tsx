"use client"

import { motion } from "framer-motion"
import type { Hour } from "@/types/weather"
import { getWeatherIcon } from "@/components/weather-icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface HourlyForecastProps {
  hours: Hour[]
  timeFormat: "12h" | "24h"
  temperatureUnit: "celsius" | "fahrenheit"
}

export function HourlyForecast({ hours, timeFormat, temperatureUnit }: HourlyForecastProps) {
  // Filter hours to only show future hours from current time
  const currentTime = new Date()
  const futureHours = hours
    .filter((hour) => {
      const hourTime = new Date(hour.time)
      return hourTime > currentTime
    })
    .slice(0, 24) // Show next 24 hours

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

  const getTemp = (hour: Hour) => {
    if (temperatureUnit === "fahrenheit") {
      return `${Math.round(hour.temp_f)}°`
    }
    return `${Math.round(hour.temp_c)}°`
  }

  return (
    <TooltipProvider>
      <Card className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-md border-muted/30 relative group">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            Hourly Forecast
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Weather forecast for the next 24 hours</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <ScrollArea className="w-full whitespace-nowrap pb-2">
            <div className="flex w-max space-x-4 p-1">
              {futureHours.map((hour, index) => {
                return (
                  <motion.div
                    key={hour.time_epoch}
                    className="flex flex-col items-center gap-1 w-[70px]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <p className="text-xs font-medium">{formatTime(hour.time)}</p>
                    <div className="text-primary">{getWeatherIcon(hour.condition.code, hour.is_day === 1, 28)}</div>
                    <p className="text-sm font-bold">{getTemp(hour)}</p>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <p className="text-xs text-muted-foreground">{hour.chance_of_rain}%</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            <ScrollBar orientation="horizontal" className="h-2 mt-2" />
          </ScrollArea>
          <p className="text-xs text-center text-muted-foreground mt-4">Scroll horizontally to see more hours</p>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
