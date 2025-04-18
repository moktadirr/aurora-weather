"use client"

import { motion } from "framer-motion"
import { AuroraLogo } from "@/components/aurora-logo"

export function Footer() {
  return (
    <motion.footer
      className="w-full py-6 px-4 mt-10 border-t border-muted/20 backdrop-blur-sm bg-background/60"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <AuroraLogo size={24} animated={false} />
              <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Aurora
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Aurora. All rights reserved.
            </span>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center mb-3">
              <a
                href="https://www.weatherapi.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm flex items-center gap-2 transition-colors hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500"
                aria-label="Powered by WeatherAPI.com (opens in a new tab)"
              >
                <span>Powered by WeatherAPI.com</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </a>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://github.com/moktadirr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 p-2"
                aria-label="GitHub profile (opens in a new tab)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a
                href="https://x.com/moktadirr_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 p-2"
                aria-label="X (Twitter) profile (opens in a new tab)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
