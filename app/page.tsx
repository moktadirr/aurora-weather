"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useWeather } from "@/hooks/use-weather"
import { LocationSearch } from "@/components/location-search"
import { CurrentWeather } from "@/components/current-weather"
import { HourlyForecast } from "@/components/hourly-forecast"
import { DailyForecast } from "@/components/daily-forecast"
import { WeatherAlerts } from "@/components/weather-alerts"
import { WeatherMetrics } from "@/components/weather-metrics"
import { PrecipitationChart } from "@/components/precipitation-chart"
import { TemperatureChart } from "@/components/temperature-chart"
import { WeatherMap } from "@/components/weather-map"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"
import { WeatherBackground } from "@/components/weather-background"
import { WelcomeScreen, type UserSettings } from "@/components/welcome-screen"
import { AuroraLogo } from "@/components/aurora-logo"
import { Footer } from "@/components/footer"

// Simple skeleton loader for components
const ComponentSkeleton = () => <div className="w-full h-40 bg-background/50 rounded-lg animate-pulse"></div>

export default function WeatherDashboard() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [settings, setSettings] = useState<UserSettings>({
    temperatureUnit: "celsius",
    timeFormat: "12h",
    theme: "dark",
    showAirQuality: true,
    showAlerts: true,
  })

  const { weatherData, isLoading, error, location, setLocation, getUserLocation } = useWeather()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if user has visited before
    const hasVisited = localStorage.getItem("aurora_has_visited")
    if (hasVisited) {
      setShowWelcome(false)
    }

    // Load saved settings if available
    const savedSettings = localStorage.getItem("aurora_settings")
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings(parsedSettings)

        // Apply theme setting
        applyTheme(parsedSettings.theme)
      } catch (e) {
        console.error("Failed to parse saved settings", e)
      }
    }
  }, [])

  const applyTheme = (theme: string) => {
    if (typeof window === "undefined") return

    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }

  const handleSearch = (searchLocation: string) => {
    setLocation(searchLocation)
    setShowWelcome(false)
    localStorage.setItem("aurora_has_visited", "true")
  }

  const handleGetUserLocation = () => {
    try {
      getUserLocation()
      setShowWelcome(false)
      localStorage.setItem("aurora_has_visited", "true")
    } catch (err) {
      console.error("Error getting user location:", err)
      // If geolocation fails, still proceed to the dashboard with default location
      setLocation("London")
      setShowWelcome(false)
      localStorage.setItem("aurora_has_visited", "true")
    }
  }

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings)
    localStorage.setItem("aurora_settings", JSON.stringify(newSettings))
    applyTheme(newSettings.theme)
  }

  const handleBackToWelcome = () => {
    setShowWelcome(true)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen text-foreground relative">
      <WeatherBackground current={weatherData?.current} />

      {/* Skip to content link for screen readers */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      <AnimatePresence mode="wait">
        {showWelcome ? (
          <WelcomeScreen
            key="welcome"
            onSearch={handleSearch}
            onGetUserLocation={handleGetUserLocation}
            onUpdateSettings={handleUpdateSettings}
            settings={settings}
          />
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col"
          >
            <div className="container mx-auto px-4 py-6 relative z-10 flex-1" id="main-content">
              <header className="flex justify-between items-center mb-6 bg-background/60 backdrop-blur-md p-3 rounded-lg border border-muted/20">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <AuroraLogo size={32} animated={false} />
                    <motion.h1
                      className="text-xl font-bold sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      Aurora
                    </motion.h1>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <LocationSearch
                    location={location}
                    onLocationChange={setLocation}
                    onGetUserLocation={getUserLocation}
                    onGoHome={handleBackToWelcome}
                    className="w-full max-w-xs"
                  />
                </div>
              </header>

              {isLoading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState error={error} onRetry={() => setLocation(location || "London")} />
              ) : weatherData ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Current Weather */}
                  <CurrentWeather
                    current={weatherData.current}
                    location={weatherData.location}
                    temperatureUnit={settings.temperatureUnit}
                  />

                  {/* Hourly Forecast */}
                  <HourlyForecast
                    hours={weatherData.forecast.forecastday[0].hour}
                    timeFormat={settings.timeFormat}
                    temperatureUnit={settings.temperatureUnit}
                  />

                  {/* Daily Forecast */}
                  <DailyForecast
                    forecastDays={weatherData.forecast.forecastday}
                    temperatureUnit={settings.temperatureUnit}
                  />

                  {/* Weather Metrics */}
                  <WeatherMetrics
                    current={weatherData.current}
                    forecast={weatherData.forecast.forecastday[0]}
                    temperatureUnit={settings.temperatureUnit}
                  />

                  {/* Interactive Weather Map */}
                  <WeatherMap location={weatherData.location} />

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TemperatureChart
                      hours={weatherData.forecast.forecastday[0].hour}
                      timeFormat={settings.timeFormat}
                      temperatureUnit={settings.temperatureUnit}
                    />
                    <PrecipitationChart
                      hours={weatherData.forecast.forecastday[0].hour}
                      timeFormat={settings.timeFormat}
                    />
                  </div>

                  {/* Air Quality and Alerts - Conditionally rendered */}
                  {settings.showAlerts &&
                    weatherData.alerts &&
                    weatherData.alerts.alert &&
                    weatherData.alerts.alert.length > 0 && <WeatherAlerts alerts={weatherData.alerts.alert} />}
                </motion.div>
              ) : null}
            </div>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
