"use client"

import { SpeedInsights as VercelSpeedInsights } from "@vercel/speed-insights/react"

export function SpeedInsights() {
  return <VercelSpeedInsights debug={process.env.NODE_ENV === "development"} />
}
