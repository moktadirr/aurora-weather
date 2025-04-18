"use client"

import { useEffect, useState, memo } from "react"
import { motion } from "framer-motion"
import type { Current } from "@/types/weather"

interface WeatherBackgroundProps {
  current?: Current
}

// Memoize the component to prevent unnecessary re-renders
export const WeatherBackground = memo(function WeatherBackground({ current }: WeatherBackgroundProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDay = current?.is_day === 1
  const conditionCode = current?.condition?.code

  // Determine background based on weather condition and time of day
  let bgGradient = "from-blue-600 via-blue-400 to-blue-300" // Default day clear sky
  let particleCount = 10 // Reduced particle count for better performance

  if (!isDay) {
    // Night time
    bgGradient = "from-slate-900 via-purple-900 to-slate-800"
  }

  if (conditionCode) {
    // Rain conditions
    if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(conditionCode)) {
      bgGradient = isDay ? "from-slate-700 via-slate-600 to-slate-500" : "from-slate-900 via-slate-800 to-slate-700"
      particleCount = 20 // Reduced from 50
    }

    // Snow conditions
    else if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(conditionCode)) {
      bgGradient = isDay ? "from-slate-300 via-blue-100 to-slate-200" : "from-slate-800 via-slate-700 to-slate-600"
      particleCount = 15 // Reduced from 40
    }

    // Cloudy conditions
    else if ([1003, 1006, 1009].includes(conditionCode)) {
      bgGradient = isDay ? "from-blue-400 via-slate-400 to-blue-300" : "from-slate-800 via-slate-700 to-slate-600"
    }

    // Thunderstorm conditions
    else if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) {
      bgGradient = isDay ? "from-slate-800 via-slate-700 to-purple-900" : "from-slate-900 via-purple-900 to-slate-800"
      particleCount = 5 // Reduced for better performance
    }
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${bgGradient}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Particles - reduced count for better performance */}
      <WeatherParticles count={particleCount} type={getParticleType(conditionCode)} isDay={isDay} />
    </div>
  )
})

// Helper function to determine particle type
function getParticleType(conditionCode?: number) {
  if (!conditionCode) return "circle"

  if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(conditionCode)) {
    return "rain"
  } else if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(conditionCode)) {
    return "snow"
  } else if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) {
    return "lightning"
  }

  return "circle"
}

interface WeatherParticlesProps {
  count: number
  type: "circle" | "rain" | "snow" | "lightning"
  isDay: boolean
}

// Memoize the particles component
const WeatherParticles = memo(function WeatherParticles({ count, type, isDay }: WeatherParticlesProps) {
  // Reduce animation complexity for better performance
  const particleColor = isDay ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.5)"

  // Generate particles only once using Array.from
  const particles = Array.from({ length: count }).map((_, i) => {
    const x = Math.random() * 100
    const y = Math.random() * 100
    const size = Math.random() * 3 + 1
    const duration = Math.random() * 20 + 10
    const delay = Math.random() * 5

    // Simplified particle rendering based on type
    switch (type) {
      case "rain":
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `-5%`,
              width: `${size / 3}px`,
              height: `${size * 10}px`,
              background: particleColor,
            }}
            initial={{ y: "-10%" }}
            animate={{ y: "110%" }}
            transition={{
              duration: duration / 3,
              repeat: Number.POSITIVE_INFINITY,
              delay,
              ease: "linear",
            }}
          />
        )

      case "snow":
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `-5%`,
              width: `${size}px`,
              height: `${size}px`,
              background: particleColor,
            }}
            initial={{ y: "-10%" }}
            animate={{ y: "110%" }}
            transition={{
              duration: duration,
              repeat: Number.POSITIVE_INFINITY,
              delay,
              ease: "linear",
            }}
          />
        )

      case "lightning":
        if (i % 20 === 0) {
          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y / 2}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 100 + 50}px`,
                background: "rgba(255, 255, 100, 0.3)",
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 0.3,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 10,
                repeatDelay: Math.random() * 20 + 10,
              }}
            />
          )
        }
        return null

      default:
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: particleColor,
            }}
            animate={{
              y: [y, y - 10, y],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration,
              repeat: Number.POSITIVE_INFINITY,
              delay,
              ease: "easeInOut",
            }}
          />
        )
    }
  })

  return <>{particles}</>
})
