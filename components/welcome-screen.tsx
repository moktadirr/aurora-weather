"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, Settings, ChevronRight } from "lucide-react"
import { AuroraLogo } from "@/components/aurora-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { trackEvent } from "@/utils/analytics"

interface WelcomeScreenProps {
  onSearch: (location: string) => void
  onGetUserLocation: () => void
  onUpdateSettings: (settings: UserSettings) => void
  settings: UserSettings
  children?: React.ReactNode
}

export interface UserSettings {
  temperatureUnit: "celsius" | "fahrenheit"
  timeFormat: "12h" | "24h"
  theme: "dark" | "light" | "system"
  showAirQuality: boolean
  showAlerts: boolean
}

export function WelcomeScreen({
  onSearch,
  onGetUserLocation,
  onUpdateSettings,
  settings,
  children,
}: WelcomeScreenProps) {
  const [searchValue, setSearchValue] = useState("")
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const popularLocations = [
    "London",
    "New York",
    "Tokyo",
    "Paris",
    "Sydney",
    "Berlin",
    "Toronto",
    "Singapore",
    "Dubai",
    "Mumbai",
    "Los Angeles",
    "Chicago",
    "Bangkok",
    "Rome",
    "Istanbul",
    "Madrid",
    "Amsterdam",
    "Seoul",
    "Cairo",
    "Rio de Janeiro",
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      onSearch(searchValue)
    }
  }

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)

    // Track settings change
    trackEvent("change_settings", {
      setting: key,
      value: String(value),
    })

    onUpdateSettings(newSettings)
  }

  useEffect(() => {
    // Apply theme setting
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (localSettings.theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(localSettings.theme)
    }
  }, [localSettings.theme])

  // Filter suggestions based on input
  useEffect(() => {
    if (searchValue.length > 0) {
      const filtered = popularLocations.filter((location) => location.toLowerCase().includes(searchValue.toLowerCase()))
      setSuggestions(filtered.slice(0, 6))
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchValue])

  // Handle clicks outside the suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm -z-10"></div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-6"
      >
        <AuroraLogo size={80} />
      </motion.div>

      <motion.h1
        className="text-4xl sm:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Aurora
      </motion.h1>

      <motion.p
        className="text-xl text-foreground mb-8 max-w-md font-medium group transition-all duration-300"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <span className="group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-300">
          Experience weather in a whole new light
        </span>
      </motion.p>

      <motion.form
        className="w-full max-w-md mb-6 relative"
        onSubmit={handleSearch}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder="Enter a city or location..."
            className="pl-9 pr-20 h-12 bg-background/80 backdrop-blur-sm border-muted/50 focus:border-primary/50"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => {
              if (searchValue.length > 0) {
                setShowSuggestions(true)
              }
            }}
            aria-label="Search location"
          />
          <Button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-10"
            disabled={!searchValue.trim()}
          >
            <span className="hidden sm:inline mr-1">Search</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Location suggestions - improved visibility */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-background/95 backdrop-blur-sm border border-muted/30 rounded-md shadow-lg">
            <ul className="py-1 text-left max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    type="button"
                    className="w-full px-4 py-2 hover:bg-muted/30 text-foreground flex items-center"
                    onClick={() => {
                      setSearchValue(suggestion)
                      onSearch(suggestion)
                    }}
                  >
                    <Search className="h-3 w-3 mr-2 text-muted-foreground" />
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.form>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Button
          variant="outline"
          onClick={onGetUserLocation}
          className="gap-2 bg-background/80 backdrop-blur-sm border-muted/50 hover:bg-background/90 hover:border-primary/50 flex-1"
        >
          <MapPin className="h-4 w-4" />
          <span>Current Location</span>
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 bg-background/80 backdrop-blur-sm border-muted/50 hover:bg-background/90 hover:border-primary/50 flex-1"
            >
              <Settings className="h-4 w-4" />
              <span>Preferences</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Personalize Your Experience</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="temperature" className="text-right">
                  Temperature
                </Label>
                <div className="col-span-3">
                  <Select
                    value={localSettings.temperatureUnit}
                    onValueChange={(value) => updateSetting("temperatureUnit", value as "celsius" | "fahrenheit")}
                  >
                    <SelectTrigger id="temperature" className="w-full">
                      <SelectValue placeholder="Temperature unit" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="w-full min-w-[200px]">
                      <SelectItem value="celsius">Celsius (°C)</SelectItem>
                      <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="timeFormat" className="text-right">
                  Time Format
                </Label>
                <div className="col-span-3">
                  <Select
                    value={localSettings.timeFormat}
                    onValueChange={(value) => updateSetting("timeFormat", value as "12h" | "24h")}
                  >
                    <SelectTrigger id="timeFormat" className="w-full">
                      <SelectValue placeholder="Time format" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="w-full min-w-[200px]">
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="theme" className="text-right">
                  Theme
                </Label>
                <div className="col-span-3">
                  <Select
                    value={localSettings.theme}
                    onValueChange={(value) => updateSetting("theme", value as "dark" | "light" | "system")}
                  >
                    <SelectTrigger id="theme" className="w-full">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="w-full min-w-[200px]">
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="airQuality" className="text-right">
                  Air Quality
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="airQuality"
                    checked={localSettings.showAirQuality}
                    onCheckedChange={(checked) => updateSetting("showAirQuality", checked)}
                  />
                  <Label htmlFor="airQuality">Show air quality data</Label>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="alerts" className="text-right">
                  Alerts
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="alerts"
                    checked={localSettings.showAlerts}
                    onCheckedChange={(checked) => updateSetting("showAlerts", checked)}
                  />
                  <Label htmlFor="alerts">Show weather alerts</Label>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div
        className="mt-6 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <p className="text-xs mb-2">Popular Locations:</p>
        <div className="flex flex-wrap justify-center gap-2 max-w-md">
          {popularLocations.slice(0, 8).map((loc, index) => (
            <button
              key={index}
              onClick={() => onSearch(loc)}
              className="text-xs px-2 py-1 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
            >
              {loc}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
