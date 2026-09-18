"use client"

import { motion } from "motion/react"
import { Home, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/Button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-xl space-y-6 text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <Image
            src="/404.gif"
            alt="404 Illustration"
            width={300}
            height={200}
            className="mx-auto"
          />

          <h1 className="hidden text-7xl font-extrabold tracking-tight text-blue-600">
            404
          </h1>
          <p className="text-foreground text-xl font-semibold">
            Page not found
          </p>
          {/* Error Description */}
          <p className="mb-8 text-lg text-slate-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been moved or deleted.
          </p>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              onClick={() => window.location.assign("/")}
              className="w-full bg-linear-to-r from-blue-600 to-cyan-600 px-8 py-3 font-semibold text-white hover:from-blue-700 hover:to-cyan-700 sm:w-auto"
            >
              <Home className="inline h-4 w-4" />
              <span className="ml-2">Go Home</span>
            </Button>

            <Button
              onClick={() => window.history.back()}
              className="w-full bg-linear-to-r from-blue-600 to-cyan-600 px-8 py-3 font-semibold text-white hover:from-blue-700 hover:to-cyan-700 sm:w-auto"
            >
              <ArrowLeft className="inline h-4 w-4" />
              <span className="ml-2">Go Back</span>
            </Button>
          </div>
        </motion.div>
        {/* Helpful Links */}
        <div className="mt-12 space-y-2 text-sm text-slate-500">
          <p>Need help? Contact us at support@capitalsfargofx.com</p>
        </div>
      </div>
    </div>
  )
}
