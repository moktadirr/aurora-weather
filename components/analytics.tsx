"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { Analytics as VercelAnalytics } from "@vercel/analytics/react"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page views
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

    // You can add custom tracking here if needed
    if (process.env.NODE_ENV === "development") {
      console.log(`Page view: ${url}`)
    }
  }, [pathname, searchParams])

  return <VercelAnalytics debug={process.env.NODE_ENV === "development"} />
}
