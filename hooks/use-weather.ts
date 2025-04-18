"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { WeatherData } from "@/types/weather"
import { useDebounce } from "@/hooks/use-debounce"

export function useWeather(initialLocation = "London") {
  const [location, setLocation] = useState(initialLocation)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const debouncedLocation = useDebounce(location, 300)

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchWeatherData = useCallback(async (query: string) => {
    if (!query) return

    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/weather?query=${encodeURIComponent(query)}`, { signal })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch weather data")
      }

      const data = await response.json()
      setWeatherData(data)
    } catch (err) {
      // Don't set error if the request was aborted
      if ((err as Error).name !== "AbortError") {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error fetching weather data:", err)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debouncedLocation) {
      fetchWeatherData(debouncedLocation)
    }

    // Cleanup function to abort any pending requests when the component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [debouncedLocation, fetchWeatherData])

  // Improved function to get user's current location
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    setIsLoading(true)

    try {
      // Use high accuracy for better results
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation(`${latitude},${longitude}`)
        },
        (err) => {
          console.error("Geolocation error:", err.message)

          // More user-friendly error messages
          let errorMessage = "Unable to get your location. "

          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage += "Please allow location access in your browser settings."
              break
            case err.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable."
              break
            case err.TIMEOUT:
              errorMessage += "The request to get your location timed out."
              break
            default:
              errorMessage += "An unknown error occurred."
          }

          setError(errorMessage)

          // Fall back to default location
          setLocation("London")
          setIsLoading(false)
        },
        options,
      )
    } catch (err) {
      console.error("Geolocation exception:", err)
      setError("Unable to access location services")
      // Fall back to default location
      setLocation("London")
      setIsLoading(false)
    }
  }, [])

  return {
    weatherData,
    isLoading,
    error,
    location,
    setLocation,
    getUserLocation,
  }
}
