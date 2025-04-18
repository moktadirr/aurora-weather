"use client"

import { motion } from "framer-motion"

interface AuroraLogoProps {
  size?: number
  className?: string
  animated?: boolean
}

export function AuroraLogo({ size = 40, className = "", animated = true }: AuroraLogoProps) {
  // More modern color palette
  const colors = ["#6366F1", "#8B5CF6", "#EC4899", "#F43F5E"]

  // Static version for better performance when animation not needed
  if (!animated) {
    return (
      <div className={`relative ${className}`} style={{ width: size, height: size }}>
        <div className="relative w-full h-full">
          {colors.map((color, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                border: `2px solid ${color}`,
                top: 0,
                left: 0,
                transform: `scale(${0.4 + i * 0.1})`,
                opacity: 0.7 - i * 0.15,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center font-bold" style={{ fontSize: size * 0.4 }}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              A
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {colors.map((color, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              border: `2px solid ${color}`,
              top: 0,
              left: 0,
            }}
            initial={{ scale: 0.4 + i * 0.1, opacity: 0.7 - i * 0.15 }}
            animate={{
              scale: [0.4 + i * 0.1, 0.6 + i * 0.1, 0.4 + i * 0.1],
              opacity: [0.7 - i * 0.15, 0.9 - i * 0.15, 0.7 - i * 0.15],
            }}
            transition={{
              duration: 3 + i,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.2,
              repeatDelay: 0.5, // Add delay between animations
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center font-bold" style={{ fontSize: size * 0.4 }}>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            A
          </span>
        </div>
      </motion.div>
    </div>
  )
}
