"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, ChevronDown } from "lucide-react"
import type { Alert } from "@/types/weather"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface WeatherAlertsProps {
  alerts: Alert[]
}

export function WeatherAlerts({ alerts }: WeatherAlertsProps) {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null)

  if (!alerts || alerts.length === 0) {
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-md border-red-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Weather Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <motion.div
              key={`${alert.headline}-${index}`}
              className="rounded-lg overflow-hidden bg-background/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div
                className="flex items-center justify-between p-3 cursor-pointer"
                onClick={() => setExpandedAlert(expandedAlert === alert.headline ? null : alert.headline)}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <h3 className="text-sm font-medium line-clamp-1">{alert.headline}</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${expandedAlert === alert.headline ? "rotate-180" : ""}`}
                  />
                </Button>
              </div>

              <AnimatePresence>
                {expandedAlert === alert.headline && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 pt-0 text-sm">
                      <p className="mb-2">{alert.desc}</p>
                      {alert.instruction && (
                        <div>
                          <p className="font-medium mt-2">Instructions:</p>
                          <p>{alert.instruction}</p>
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <p>Until: {new Date(alert.expires).toLocaleString()}</p>
                        <p>Severity: {alert.severity}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
