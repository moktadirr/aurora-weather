import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@/components/analytics"

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Prevent layout shift during font loading
  preload: true,
  fallback: ["system-ui", "sans-serif"],
})

export const metadata: Metadata = {
  title: "Aurora - Weather Dashboard",
  description: "Experience weather in a whole new light with Aurora's futuristic weather dashboard",
  keywords: "weather, forecast, aurora, dashboard, real-time weather",
  authors: [{ name: "Moktadir", url: "https://github.com/moktadirr" }],
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="dark light" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />

        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://api.weatherapi.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>{children}</Suspense>
        </ThemeProvider>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <SpeedInsights />
      </body>
    </html>
  )
}
