"use client"

import { memo } from "react"

// Memoize the component to prevent unnecessary re-renders
export const LoadingState = memo(function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]" aria-live="polite" aria-busy="true">
      {/* Simplified loading animation for better performance */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      <p className="mt-6 text-lg font-medium animate-pulse">Loading weather data...</p>

      {/* Hidden text for screen readers with more details */}
      <span className="sr-only">
        Please wait while we fetch the latest weather information. This may take a few seconds.
      </span>
    </div>
  )
})
