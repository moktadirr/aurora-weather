"use client"

import { motion } from "framer-motion"
import type { ForecastDay } from "@/types/weather"
import { getWeatherIcon } from "@/components/weather-icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DailyForecastProps {
  forecastDays: ForecastDay[]
  temperatureUnit: "celsius" | "fahrenheit"
}

export function DailyForecast({ forecastDays, temperatureUnit }: DailyForecastProps) {
  const getTemp = (temp: number) => {
    if (temperatureUnit === "fahrenheit") {
      return `${Math.round(temp)}°`
    }
    return `${Math.round(temp)}°`
  }

  return (
    <Card className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-md border-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">3-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {forecastDays.map((day, index) => {
            const date = new Date(day.date)
            const formattedDay = date.toLocaleDateString("en-US", {
              weekday: "long",
            })

            return (
              <motion.div
                key={day.date_epoch}
                className="flex items-center justify-between py-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <p className="w-[100px] text-sm font-medium">{index === 0 ? "Today" : formattedDay}</p>
                  <div className="text-primary">{getWeatherIcon(day.day.condition.code, true, 24)}</div>
                  <p className="text-xs text-muted-foreground hidden sm:block">{day.day.condition.text}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <p className="text-xs text-muted-foreground">{day.day.daily_chance_of_rain}%</p>
                  </div>
                  <div className="flex gap-2 min-w-[80px] justify-end">
                    <p className="text-sm font-medium">
                      {temperatureUnit === "celsius" ? getTemp(day.day.maxtemp_c) : getTemp(day.day.maxtemp_f)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {temperatureUnit === "celsius" ? getTemp(day.day.mintemp_c) : getTemp(day.day.mintemp_f)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
