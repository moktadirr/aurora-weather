"use client"

import { motion } from "framer-motion"
import { CloudOff, RefreshCw, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  error: string
  onRetry: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-red-500 mb-4"
      >
        <CloudOff size={48} />
      </motion.div>

      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-xl font-bold mb-2"
      >
        Weather Data Unavailable
      </motion.h2>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-foreground mb-6 max-w-md"
      >
        {error || "We couldn't fetch the weather data. Please check your connection and try again."}
      </motion.p>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            // Use a more reliable approach without directly calling geolocation
            onRetry()
          }}
          className="gap-2"
        >
          <MapPin className="h-4 w-4" />
          Try Default Location
        </Button>
      </motion.div>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-sm text-muted-foreground mt-6"
      >
        Try searching for a specific city or use the default location.
      </motion.p>
    </div>
  )
}
