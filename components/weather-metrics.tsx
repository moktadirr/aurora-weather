"use client"

import { motion } from "framer-motion"
import { Sunrise, Sunset, Droplets, Wind, Thermometer, Gauge, Umbrella, Eye, Info, Compass } from "lucide-react"
import type { Current, ForecastDay } from "@/types/weather"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WeatherMetricsProps {
  current: Current
  forecast: ForecastDay
  temperatureUnit: "celsius" | "fahrenheit"
}

export function WeatherMetrics({ current, forecast, temperatureUnit }: WeatherMetricsProps) {
  const getTemp = (temp: number) => {
    if (temperatureUnit === "fahrenheit") {
      return `${Math.round(temp)}°F`
    }
    return `${Math.round(temp)}°C`
  }

  // Calculate sunrise/sunset progress
  const calculateDayProgress = () => {
    const now = new Date()
    const sunriseTime = new Date(`${forecast.date} ${forecast.astro.sunrise}`)
    const sunsetTime = new Date(`${forecast.date} ${forecast.astro.sunset}`)

    // Handle case where sunrise/sunset might be on the next day
    if (sunriseTime > sunsetTime) {
      sunsetTime.setDate(sunsetTime.getDate() + 1)
    }

    const dayLength = sunsetTime.getTime() - sunriseTime.getTime()
    const elapsed = now.getTime() - sunriseTime.getTime()

    if (now < sunriseTime) return 0
    if (now > sunsetTime) return 100

    return Math.min(100, Math.max(0, (elapsed / dayLength) * 100))
  }

  const dayProgress = calculateDayProgress()

  return (
    <TooltipProvider>
      <Card className="bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-md border-muted/30 relative group">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            Weather Metrics
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Detailed weather measurements and conditions</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sun Position */}
            <motion.div
              className="space-y-3 p-4 rounded-lg bg-background/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-sm font-medium mb-2">Sun Position</h3>
              <div className="flex justify-between items-center mb-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-amber-500 cursor-help">
                      <Sunrise className="h-4 w-4" />
                      <span className="text-xs">{forecast.astro.sunrise}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sunrise time</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-indigo-400 cursor-help">
                      <Sunset className="h-4 w-4" />
                      <span className="text-xs">{forecast.astro.sunset}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sunset time</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative h-3 bg-gradient-to-r from-indigo-950 via-amber-500 to-indigo-950 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
                <motion.div
                  className="absolute top-0 h-full w-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                  style={{ left: `${dayProgress}%`, transform: "translateX(-50%)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                ></motion.div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Dawn</span>
                <span>Noon</span>
                <span>Dusk</span>
              </div>
            </motion.div>

            {/* Humidity */}
            <motion.div
              className="space-y-3 p-4 rounded-lg bg-background/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-sm font-medium mb-2">Humidity</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-between items-center cursor-help mb-2">
                    <div className="flex items-center gap-1">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Current Level</span>
                    </div>
                    <span className="text-sm font-bold">{current.humidity}%</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Relative humidity in the air</p>
                </TooltipContent>
              </Tooltip>
              <Progress value={current.humidity} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Dry</span>
                <span>Comfortable</span>
                <span>Humid</span>
              </div>
            </motion.div>

            {/* Wind - Improved with compass */}
            <motion.div
              className="space-y-3 p-4 rounded-lg bg-background/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-sm font-medium mb-2">Wind</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-between items-center cursor-help mb-2">
                    <div className="flex items-center gap-1">
                      <Wind className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Current</span>
                    </div>
                    <span className="text-sm font-bold">
                      {current.wind_kph} km/h {current.wind_dir}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Wind speed and direction</p>
                </TooltipContent>
              </Tooltip>
              <div className="relative h-24 w-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-muted/30"></div>
                {/* Compass directions */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 text-xs font-bold">N</div>
                <div className="absolute right-0 top-1/2 translate-x-1 -translate-y-1/2 text-xs font-bold">E</div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 text-xs font-bold">S</div>
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 text-xs font-bold">W</div>

                {/* Wind direction arrow */}
                <motion.div
                  className="absolute top-1/2 left-1/2 w-16 h-1 bg-blue-500 origin-left rounded-full"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${current.wind_degree}deg)`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-blue-500"></div>
                </motion.div>

                {/* Compass center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Compass className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </motion.div>

            {/* Feels Like */}
            <motion.div
              className="space-y-3 p-4 rounded-lg bg-background/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-sm font-medium mb-2">Feels Like</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-between items-center cursor-help mb-2">
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Temperature</span>
                    </div>
                    <span className="text-sm font-bold">
                      {temperatureUnit === "celsius" ? getTemp(current.feelslike_c) : getTemp(current.feelslike_f)}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>How the temperature actually feels on your skin</p>
                </TooltipContent>
              </Tooltip>
              <div className="relative h-8 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
                <motion.div
                  className="absolute top-0 h-full w-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                  style={{
                    left: `${Math.min(
                      100,
                      Math.max(
                        0,
                        (((temperatureUnit === "celsius" ? current.feelslike_c : current.feelslike_f) + 20) / 60) * 100,
                      ),
                    )}%`,
                    transform: "translateX(-50%)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                ></motion.div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Cold</span>
                <span>Pleasant</span>
                <span>Hot</span>
              </div>
            </motion.div>

            {/* Pressure */}
            <motion.div
              className="space-y-3 p-4 rounded-lg bg-background/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-sm font-medium mb-2">Pressure</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-between items-center cursor-help mb-2">
                    <div className="flex items-center gap-1">
                      <Gauge className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Current</span>
                    </div>
                    <span className="text-sm font-bold">{current.pressure_mb} mb</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Atmospheric pressure in millibars</p>
                  <p className="text-xs text-muted-foreground">Standard pressure is 1013.25 mb</p>
                </TooltipContent>
              </Tooltip>
              <Progress value={Math.min(100, Math.max(0, ((current.pressure_mb - 970) / 80) * 100))} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Low</span>
                <span>Normal</span>
                <span>High</span>
              </div>
            </motion.div>

            {/* Precipitation */}
            <motion.div
              className="space-y-3 p-4 rounded-lg bg-background/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-sm font-medium mb-2">Precipitation</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-between items-center cursor-help mb-2">
                    <div className="flex items-center gap-1">
                      <Umbrella className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Last Hour</span>
                    </div>
                    <span className="text-sm font-bold">{current.precip_mm} mm</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Amount of rainfall in the last hour</p>
                </TooltipContent>
              </Tooltip>
              <div className="h-8 bg-background/50 rounded-lg overflow-hidden relative">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-300"
                  style={{ height: `${Math.min(100, current.precip_mm * 20)}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                  {current.precip_mm > 0 ? `${current.precip_mm} mm` : "No precipitation"}
                </div>
              </div>
            </motion.div>

            {/* Visibility */}
            <motion.div
              className="space-y-3 p-4 rounded-lg bg-background/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-sm font-medium mb-2">Visibility</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-between items-center cursor-help mb-2">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-cyan-500" />
                      <span className="text-sm">Distance</span>
                    </div>
                    <span className="text-sm font-bold">{current.vis_km} km</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>How far you can see in current conditions</p>
                </TooltipContent>
              </Tooltip>
              <Progress value={Math.min(100, (current.vis_km / 10) * 100)} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Poor</span>
                <span>Moderate</span>
                <span>Clear</span>
              </div>
            </motion.div>

            {/* UV Index */}
            <motion.div
              className="space-y-3 p-4 rounded-lg bg-background/50 md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h3 className="text-sm font-medium mb-2">UV Index</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-between items-center cursor-help mb-2">
                    <div className="flex items-center gap-1">
                      <svg
                        className="h-4 w-4 text-yellow-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5M17.6859 17.69L18.5 18.5M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm">Current Level</span>
                    </div>
                    <span className="text-sm font-bold">{current.uv} of 11</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ultraviolet radiation level</p>
                  <p className="text-xs">0-2: Low, 3-5: Moderate, 6-7: High, 8-10: Very High, 11+: Extreme</p>
                </TooltipContent>
              </Tooltip>
              <div className="relative">
                <div className="h-3 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
                </div>
                <motion.div
                  className="absolute top-0 h-3 w-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                  style={{
                    left: `${Math.min(100, (current.uv / 11) * 100)}%`,
                    transform: "translateX(-50%)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                ></motion.div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Low</span>
                <span>Moderate</span>
                <span>High</span>
                <span>Very High</span>
                <span>Extreme</span>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
