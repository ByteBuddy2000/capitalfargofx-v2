import React, { useState } from "react"
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react"
import { Modal } from "../ui/Modal"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { useToast } from "../ui/Toast"

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { success } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setSubmitted(true)
      success(
        "Recovery Instructions Sent",
        "Check your inbox for the password reset link"
      )
    }, 600)
  }

  const handleReset = () => {
    setSubmitted(false)
    setEmail("")
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="Reset Account Password"
      description="Enter your registered email address to receive password recovery instructions."
      maxWidth="md"
    >
      {submitted ? (
        <div className="space-y-4 py-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Recovery Email Dispatched
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              If an active investor account matches{" "}
              <span className="font-semibold text-slate-900">{email}</span>, a
              cryptographic reset token has been delivered.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleReset}
            className="w-full justify-center"
          >
            Return to Login
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Registered Email Address"
            type="email"
            placeholder="e.g. investor@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-4 w-4" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="mt-2 w-full justify-center"
          >
            Send Recovery Link
          </Button>
        </form>
      )}
    </Modal>
  )
}
