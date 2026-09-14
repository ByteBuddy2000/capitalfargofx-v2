import React, { createContext, useContext, useState, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"

export type ToastType = "success" | "error" | "info"

export interface ToastMessage {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextValue {
  showToast: (type: ToastType, title: string, message?: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
      const newToast: ToastMessage = { id, type, title, message }
      setToasts((prev) => [newToast, ...prev.slice(0, 4)])

      setTimeout(() => {
        removeToast(id)
      }, 4500)
    },
    [removeToast]
  )

  const success = useCallback(
    (title: string, message?: string) => showToast("success", title, message),
    [showToast]
  )
  const error = useCallback(
    (title: string, message?: string) => showToast("error", title, message),
    [showToast]
  )
  const info = useCallback(
    (title: string, message?: string) => showToast("info", title, message),
    [showToast]
  )

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      <div className="pointer-events-none fixed right-5 bottom-5 z-50 flex w-full max-w-md flex-col gap-2 px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md ${
                toast.type === "success"
                  ? "border-emerald-700/50 bg-emerald-950/90 text-white"
                  : toast.type === "error"
                    ? "border-rose-700/50 bg-rose-950/90 text-white"
                    : "border-slate-700/50 bg-slate-900/90 text-white"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {toast.type === "success" && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                )}
                {toast.type === "error" && (
                  <AlertCircle className="h-5 w-5 text-rose-400" />
                )}
                {toast.type === "info" && (
                  <Info className="h-5 w-5 text-blue-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold tracking-tight">
                  {toast.title}
                </p>
                {toast.message && (
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-300">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
