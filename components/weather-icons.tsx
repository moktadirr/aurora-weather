"use client"

import { memo } from "react"
import { motion } from "framer-motion"

interface WeatherIconProps {
  className?: string
  size?: number
}

// Memoize all icon components to prevent unnecessary re-renders
export const SunIcon = memo(function SunIcon({ className, size = 24 }: WeatherIconProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    >
      <circle cx="12" cy="12" r="4" />
      <motion.g
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      >
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
        <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
        <line x1="2" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
        <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
      </motion.g>
    </motion.svg>
  )
})

// Similarly memoize other icon components...
export const MoonIcon = memo(function MoonIcon({ className, size = 24 }: WeatherIconProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={{ rotate: -10 }}
      animate={{ rotate: 10 }}
      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </motion.svg>
  )
})

export const CloudIcon = memo(function CloudIcon({ className, size = 24 }: WeatherIconProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={{ x: -5 }}
      animate={{ x: 5 }}
      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </motion.svg>
  )
})

export const RainIcon = memo(function RainIcon({ className, size = 24 }: WeatherIconProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      <motion.path
        d="M9 19v2"
        initial={{ y: -2, opacity: 0 }}
        animate={{ y: 2, opacity: 1 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", ease: "easeIn", delay: 0 }}
      />
      <motion.path
        d="M13 19v2"
        initial={{ y: -2, opacity: 0 }}
        animate={{ y: 2, opacity: 1 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", ease: "easeIn", delay: 0.2 }}
      />
      <motion.path
        d="M17 19v2"
        initial={{ y: -2, opacity: 0 }}
        animate={{ y: 2, opacity: 1 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", ease: "easeIn", delay: 0.4 }}
      />
    </motion.svg>
  )
})

export const SnowIcon = memo(function SnowIcon({ className, size = 24 }: WeatherIconProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      <motion.path
        d="M8 15h.01"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0,
        }}
      />
      <motion.path
        d="M12 15h.01"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
      <motion.path
        d="M16 15h.01"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
      <motion.path
        d="M8 19h.01"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.3,
        }}
      />
      <motion.path
        d="M12 19h.01"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      <motion.path
        d="M16 19h.01"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.7,
        }}
      />
    </motion.svg>
  )
})

export const ThunderstormIcon = memo(function ThunderstormIcon({ className, size = 24 }: WeatherIconProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      <motion.path
        d="M12 10l-2 5h4l-2 5"
        initial={{ opacity: 0.2, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
    </motion.svg>
  )
})

export const MistIcon = memo(function MistIcon({ className, size = 24 }: WeatherIconProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <motion.path
        d="M3 10h4"
        initial={{ x: -3 }}
        animate={{ x: 3 }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0,
        }}
      />
      <motion.path
        d="M9 10h4"
        initial={{ x: -2 }}
        animate={{ x: 2 }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
      <motion.path
        d="M17 10h4"
        initial={{ x: -3 }}
        animate={{ x: 3 }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
      <motion.path
        d="M3 14h4"
        initial={{ x: 3 }}
        animate={{ x: -3 }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      <motion.path
        d="M9 14h4"
        initial={{ x: 2 }}
        animate={{ x: -2 }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.3,
        }}
      />
      <motion.path
        d="M17 14h4"
        initial={{ x: 3 }}
        animate={{ x: -3 }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.1,
        }}
      />
    </motion.svg>
  )
})

export const WindIcon = memo(function WindIcon({ className, size = 24 }: WeatherIconProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <motion.path
        d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"
        initial={{ x: -5 }}
        animate={{ x: 5 }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0,
        }}
      />
      <motion.path
        d="M9.6 4.6A2 2 0 1 1 11 8H2"
        initial={{ x: -3 }}
        animate={{ x: 3 }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
      <motion.path
        d="M12.6 19.4A2 2 0 1 0 14 16H2"
        initial={{ x: -4 }}
        animate={{ x: 4 }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
    </motion.svg>
  )
})

// Optimize the getWeatherIcon function with memoization
const iconCache = new Map()

export function getWeatherIcon(code: number, isDay: boolean, size = 24) {
  // Create a cache key
  const cacheKey = `${code}-${isDay}-${size}`

  // Return cached icon if available
  if (iconCache.has(cacheKey)) {
    return iconCache.get(cacheKey)
  }

  let icon

  if (code === 1000) {
    icon = isDay ? <SunIcon size={size} /> : <MoonIcon size={size} />
  } else if ([1003, 1006, 1009].includes(code)) {
    icon = <CloudIcon size={size} />
  } else if ([1030, 1135, 1147].includes(code)) {
    icon = <MistIcon size={size} />
  } else if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) {
    icon = <RainIcon size={size} />
  } else if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) {
    icon = <SnowIcon size={size} />
  } else if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
    icon = <ThunderstormIcon size={size} />
  } else {
    icon = isDay ? <SunIcon size={size} /> : <MoonIcon size={size} />
  }

  // Cache the result
  iconCache.set(cacheKey, icon)
  return icon
}
