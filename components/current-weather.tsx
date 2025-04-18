"use client"

import { motion } from "framer-motion"
import { Droplets, Thermometer, Wind, Info } from "lucide-react"
import type { Current, Location } from "@/types/weather"
import { getWeatherIcon } from "@/components/weather-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CurrentWeatherProps {
  current: Current
  location: Location
  temperatureUnit: "celsius" | "fahrenheit"
}

export function CurrentWeather({ current, location, temperatureUnit }: CurrentWeatherProps) {
  const isDay = current.is_day === 1
  const formattedDate = new Date(location.localtime).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  const formattedTime = new Date(location.localtime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const getTemp = (temp: number) => {
    if (temperatureUnit === "fahrenheit") {
      return `${Math.round(temp)}°F`
    }
    return `${Math.round(temp)}°C`
  }

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-md border-muted/30">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 justify-between">
          {/* Location Information */}
          <div className="flex flex-col gap-2">
            <motion.h2
              className="text-2xl font-bold tracking-tight"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {location.name}
            </motion.h2>
            <motion.p
              className="text-sm font-medium"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {location.region && `${location.region}, `}
              {location.country}
            </motion.p>
            <motion.p
              className="text-sm"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {formattedDate} • {formattedTime}
            </motion.p>

            {/* Air Quality Summary */}
            {current.air_quality && (
              <motion.div
                className="mt-2 flex items-center gap-2"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className={`h-2 w-2 rounded-full ${getAqiColor(current.air_quality["us-epa-index"])}`}></div>
                <span className="text-sm font-medium">
                  Air Quality: {getAqiText(current.air_quality["us-epa-index"])}
                </span>
              </motion.div>
            )}
          </div>

          {/* Current Weather */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-primary">{getWeatherIcon(current.condition.code, isDay, 64)}</div>
            <div>
              <h3 className="text-5xl font-bold">
                {temperatureUnit === "celsius" ? getTemp(current.temp_c) : getTemp(current.temp_f)}
              </h3>
              <p className="text-base font-medium">
                Feels like {temperatureUnit === "celsius" ? getTemp(current.feelslike_c) : getTemp(current.feelslike_f)}
              </p>
              <p className="text-base font-medium mt-1">{current.condition.text}</p>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-muted/30 my-6"></div>

        {/* Air Quality Card */}
        {current.air_quality && (
          <motion.div
            className="mb-6 p-4 rounded-lg bg-background/70 backdrop-blur-md border border-muted/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <svg className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 12S9 9 12 9 16 12 16 12 15 15 12 15 8 12 8 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 12C12.5523 12 13 11.5523 13 11C13 10.4477 12.5523 10 12 10C11.4477 10 11 10.4477 11 11C11 11.5523 11.4477 12 12 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Air Quality
            </h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">US EPA Index:</span>
              <span className={`text-sm font-bold ${getAqiColor(current.air_quality["us-epa-index"], true)}`}>
                {getAqiText(current.air_quality["us-epa-index"])}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">PM2.5</p>
                <p className="font-medium">{current.air_quality.pm2_5.toFixed(1)} μg/m³</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">PM10</p>
                <p className="font-medium">{current.air_quality.pm10.toFixed(1)} μg/m³</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">O₃</p>
                <p className="font-medium">{current.air_quality.o3.toFixed(1)} μg/m³</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">NO₂</p>
                <p className="font-medium">{current.air_quality.no2.toFixed(1)} μg/m³</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          className="grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-background/70 relative group">
                  <Wind className="h-5 w-5 text-blue-500" />
                  <p className="text-xs font-medium">Wind</p>
                  <p className="text-sm font-bold">{current.wind_kph} km/h</p>
                  <Info className="h-3 w-3 absolute top-1 right-1 opacity-0 group-hover:opacity-50 transition-opacity" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Wind speed and direction</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-background/70 relative group">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <p className="text-xs font-medium">Humidity</p>
                  <p className="text-sm font-bold">{current.humidity}%</p>
                  <Info className="h-3 w-3 absolute top-1 right-1 opacity-0 group-hover:opacity-50 transition-opacity" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Relative humidity in the air</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-background/70 relative group">
                  <Thermometer className="h-5 w-5 text-blue-500" />
                  <p className="text-xs font-medium">Pressure</p>
                  <p className="text-sm font-bold">{current.pressure_mb} mb</p>
                  <Info className="h-3 w-3 absolute top-1 right-1 opacity-0 group-hover:opacity-50 transition-opacity" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Atmospheric pressure in millibars</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      </CardContent>
    </Card>
  )
}

// Helper functions for air quality
function getAqiColor(level: number, isText = false) {
  if (isText) {
    switch (level) {
      case 1:
        return "text-green-500"
      case 2:
        return "text-yellow-500"
      case 3:
        return "text-orange-500"
      case 4:
        return "text-red-500"
      case 5:
        return "text-purple-500"
      case 6:
        return "text-rose-900"
      default:
        return "text-green-500"
    }
  }

  switch (level) {
    case 1:
      return "bg-green-500"
    case 2:
      return "bg-yellow-500"
    case 3:
      return "bg-orange-500"
    case 4:
      return "bg-red-500"
    case 5:
      return "bg-purple-500"
    case 6:
      return "bg-rose-900"
    default:
      return "bg-green-500"
  }
}

function getAqiText(level: number) {
  switch (level) {
    case 1:
      return "Good"
    case 2:
      return "Moderate"
    case 3:
      return "Unhealthy for Sensitive Groups"
    case 4:
      return "Unhealthy"
    case 5:
      return "Very Unhealthy"
    case 6:
      return "Hazardous"
    default:
      return "Unknown"
  }
}
