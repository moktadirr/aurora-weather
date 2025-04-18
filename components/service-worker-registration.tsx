"use client"

import { useEffect } from "react"

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Only register in production and on the client side
    if (typeof window !== "undefined" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      // Delay registration until after the page has loaded
      window.addEventListener("load", () => {
        try {
          navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
              console.log("Service Worker registered with scope:", registration.scope)
            })
            .catch((error) => {
              console.error("Service Worker registration failed:", error)
            })
        } catch (error) {
          console.error("Service Worker registration error:", error)
        }
      })
    }
  }, [])

  return null
}
