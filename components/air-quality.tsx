"use client"

import { motion } from "framer-motion"
import { Wind } from "lucide-react"
import type { AirQuality as AirQualityType } from "@/types/weather"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AirQualityProps {
  airQuality: AirQualityType
}

export function AirQuality({ airQuality }: AirQualityProps) {
  // US EPA Air Quality Index
  // 1 = Good, 2 = Moderate, 3 = Unhealthy for sensitive groups,
  // 4 = Unhealthy, 5 = Very Unhealthy, 6 = Hazardous
  const aqiLevel = airQuality["us-epa-index"]

  const getAqiColor = (level: number) => {
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

  const getAqiText = (level: number) => {
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

  const getAqiProgress = (level: number) => {
    return (level / 6) * 100
  }

  return (
    <Card className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-md border-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Wind className="h-5 w-5 text-blue-500" />
          Air Quality
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">US EPA Index</p>
            <p className={`text-sm font-bold ${getAqiColor(aqiLevel)}`}>{getAqiText(aqiLevel)}</p>
          </div>

          <Progress value={getAqiProgress(aqiLevel)} className="h-2" />

          <div className="grid grid-cols-2 gap-4 pt-2">
            <motion.div
              className="space-y-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs text-muted-foreground">PM2.5</p>
              <p className="text-sm font-medium">{airQuality.pm2_5.toFixed(1)} μg/m³</p>
            </motion.div>
            <motion.div
              className="space-y-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <p className="text-xs text-muted-foreground">PM10</p>
              <p className="text-sm font-medium">{airQuality.pm10.toFixed(1)} μg/m³</p>
            </motion.div>
            <motion.div
              className="space-y-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <p className="text-xs text-muted-foreground">O₃ (Ozone)</p>
              <p className="text-sm font-medium">{airQuality.o3.toFixed(1)} μg/m³</p>
            </motion.div>
            <motion.div
              className="space-y-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <p className="text-xs text-muted-foreground">NO₂</p>
              <p className="text-sm font-medium">{airQuality.no2.toFixed(1)} μg/m³</p>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
