"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, X, Home } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { trackEvent, trackInteractionPerformance } from "@/utils/analytics"

interface LocationSearchProps {
  location: string
  onLocationChange: (location: string) => void
  onGetUserLocation: () => void
  onGoHome?: () => void
  className?: string
}

export function LocationSearch({
  location,
  onLocationChange,
  onGetUserLocation,
  onGoHome,
  className,
}: LocationSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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
    "Lima",
    "Lisbon",
    "Vienna",
    "Prague",
    "Budapest",
    "Athens",
    "Stockholm",
    "Oslo",
    "Helsinki",
    "Copenhagen",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      // Track the search event
      trackEvent("search_location", { query: inputValue })

      // Track performance of location change
      trackInteractionPerformance(
        "location_change",
        () => {
          onLocationChange(inputValue)
          setIsExpanded(false)
        },
        200,
      )
    }
  }

  const handleClear = () => {
    if (inputRef.current) {
      setInputValue("")
      inputRef.current.focus()
    }
  }

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  // Filter suggestions based on input
  useEffect(() => {
    const filterSuggestions = () => {
      if (inputValue.length > 0) {
        const filtered = popularLocations.filter((loc) => loc.toLowerCase().includes(inputValue.toLowerCase()))
        setSuggestions(filtered.slice(0, 6))
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }

    // Track performance of filtering suggestions
    trackInteractionPerformance("filter_suggestions", filterSuggestions, 50)
  }, [inputValue])

  // Handle clicks outside the suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence>
        {!isExpanded ? (
          <motion.div
            key="search-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-2"
          >
            {onGoHome && (
              <Button
                variant="outline"
                size="icon"
                onClick={onGoHome}
                aria-label="Go to welcome screen"
                className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300"
              >
                <Home className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsExpanded(true)}
              aria-label="Search location"
              className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                try {
                  // Track the current location event
                  trackEvent("use_current_location")

                  // Track performance of getting user location
                  trackInteractionPerformance("get_user_location", onGetUserLocation, 500)
                } catch (err) {
                  console.error("Error accessing location:", err)
                  // If geolocation fails, we'll rely on the error handling in the hook
                }
              }}
              aria-label="Get current location"
              className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="search-form"
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: 40, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
            onSubmit={handleSubmit}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="Search location..."
                className="pl-9 pr-9 bg-background/80 backdrop-blur-sm"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => {
                  if (inputValue.length > 0) {
                    setShowSuggestions(true)
                  }
                }}
                aria-label="Search for a location"
              />
              {inputValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground"
                  onClick={handleClear}
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}

              {/* Location suggestions - improved contrast and visibility */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-background/95 backdrop-blur-md border border-primary/20 rounded-md shadow-lg">
                  <ul className="py-1 text-left max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          className="w-full px-4 py-2 hover:bg-primary/10 text-foreground flex items-center transition-colors"
                          onClick={() => {
                            setInputValue(suggestion)

                            // Track performance of selecting a suggestion
                            trackInteractionPerformance(
                              "select_suggestion",
                              () => {
                                onLocationChange(suggestion)
                                setIsExpanded(false)
                              },
                              200,
                            )
                          }}
                        >
                          <Search className="h-3 w-3 mr-2 text-primary" />
                          {suggestion}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsExpanded(false)}
              className="bg-background/80 backdrop-blur-sm"
              aria-label="Cancel search"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
