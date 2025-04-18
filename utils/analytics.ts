"use client"

type EventName =
  | "search_location"
  | "use_current_location"
  | "change_settings"
  | "view_weather_map"
  | "toggle_map_layer"
  | "view_forecast"
  | "view_welcome_screen"
  | "performance_issue"

type EventProperties = Record<string, string | number | boolean>

export function trackEvent(eventName: EventName, properties?: EventProperties) {
  // This will be automatically picked up by Vercel Analytics
  if (typeof window !== "undefined" && "va" in window) {
    try {
      // @ts-ignore - Vercel Analytics adds this to the window object
      window.va?.track(eventName, properties)
    } catch (error) {
      console.error("Error tracking event:", error)
    }
  }

  // Log events in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${eventName}`, properties)
  }
}

// Track performance issues
export function trackPerformanceIssue(metricName: string, value: number, threshold: number) {
  if (value > threshold) {
    try {
      trackEvent("performance_issue", {
        metric: metricName,
        value,
        threshold,
        exceededBy: value - threshold,
      })
    } catch (error) {
      console.error("Error tracking performance issue:", error)
    }
  }
}

// Custom performance tracking for important user interactions
export function trackInteractionPerformance(interactionName: string, callback: () => void, expectedDuration = 100) {
  try {
    const startTime = performance.now()

    try {
      callback()
    } finally {
      const endTime = performance.now()
      const duration = endTime - startTime

      if (duration > expectedDuration) {
        trackPerformanceIssue(`slow_interaction_${interactionName}`, duration, expectedDuration)
      }
    }
  } catch (error) {
    console.error("Error tracking interaction performance:", error)
  }
}
