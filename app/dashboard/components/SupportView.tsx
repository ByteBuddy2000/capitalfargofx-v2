import React, { useState } from "react"
import { Headphones, Mail, Send, ArrowRight } from "lucide-react"
import { PlatformSettings, SupportTicket, User } from "@/types"
import { createUserSupportTicket } from "@/controller/getUserDashboard.actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { useToast } from "@/components/ui/Toast"

interface SupportViewProps {
  currentUser: User
  initialSettings: PlatformSettings | null
  initialTickets: SupportTicket[]
}

export const SupportView: React.FC<SupportViewProps> = ({
  currentUser,
  initialSettings,
  initialTickets,
}) => {
  const [subject, setSubject] = useState("")
  const [category, setCategory] = useState("Deposits & Blockchain Verification")
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { success } = useToast()
  const settings = initialSettings || {
    supportEmail: "",
    telegramChannel: "",
    updatedAt: "",
  }
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets)

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) return

    setIsSubmitting(true)
    try {
      const result = await createUserSupportTicket({
        subject: subject.trim(),
        category,
        priority,
        message: message.trim(),
      })
      if (!result.success || !result.ticket)
        throw new Error(result.message || "Unable to submit support inquiry.")
      const ticket = result.ticket as unknown as SupportTicket
      setTickets((current) => [ticket, ...current])
      setSubject("")
      setMessage("")
      success(
        "Ticket Submitted",
        "Our institutional investor support desk will review your inquiry promptly."
      )
    } catch (error) {
      success(
        "Ticket Error",
        error instanceof Error
          ? error.message
          : "Unable to submit support inquiry."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-slate-900">
            <Headphones className="h-6 w-6 text-teal-600" />
            Investor Support Desk
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            24/7 dedicated support for deposits, contract questions, and
            compliance verifications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Column: Direct Channels & Create Ticket */}
        <div className="space-y-6 lg:col-span-7">
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Create Support Inquiry
              </h3>
              <p className="text-xs text-slate-500">
                Submit a prioritized inquiry directly to the operations desk
              </p>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <Input
                label="Subject / Topic"
                placeholder="e.g. Inquiring regarding Bitcoin deposit confirmation"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:outline-none"
                  >
                    <option>Deposits & Blockchain Verification</option>
                    <option>Withdrawals & Payout Liquidity</option>
                    <option>Investment Plan Inquiries</option>
                    <option>Referral & Commission Tracking</option>
                    <option>Security & Wallet Updates</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="LOW">Low - General Inquiries</option>
                    <option value="MEDIUM">Medium - Standard Request</option>
                    <option value="HIGH">
                      High - Urgent Transaction Assistance
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold tracking-wider text-slate-700 uppercase">
                  Message Details
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide detailed information regarding your inquiry, including relevant transaction IDs or wallet addresses..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="w-full justify-center bg-teal-600 font-bold shadow-md shadow-teal-600/20 hover:bg-teal-700"
              >
                Submit Inquiry
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column: Direct Channels & Ticket History */}
        <div className="space-y-6 lg:col-span-5">
          {/* Direct Channels */}
          <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-sm">
            <span className="block text-xs font-bold tracking-wider text-teal-400 uppercase">
              Official Communication Channels
            </span>

            <div className="space-y-3 text-xs">
              <a
                href={`mailto:${settings.supportEmail}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800/80 p-3 transition-colors hover:bg-slate-800"
              >
                <Mail className="h-5 w-5 shrink-0 text-teal-400" />
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">
                    Email Support
                  </span>
                  <span className="text-xs font-bold text-white">
                    {settings.supportEmail}
                  </span>
                </div>
              </a>

              <a
                href={settings.telegramChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800/80 p-3 transition-colors hover:bg-slate-800"
              >
                <Send className="h-5 w-5 shrink-0 text-blue-400" />
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">
                    Telegram VIP Channel
                  </span>
                  <span className="text-xs font-bold text-white">
                    Join Broadcast Community
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Ticket History */}
          <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">
              Your Support Inquiries ({tickets.length})
            </h3>

            {tickets.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-500">
                No active support tickets.
              </p>
            ) : (
              <div className="max-h-72 space-y-2.5 overflow-y-auto">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="max-w-[180px] truncate font-bold text-slate-900">
                        {t.subject}
                      </span>
                      <Badge
                        variant={
                          t.status === "RESOLVED"
                            ? "success"
                            : t.status === "IN_PROGRESS"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {t.status}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-[11px] text-slate-600">
                      {t.message}
                    </p>
                    <span className="mt-1 block font-mono text-[10px] text-slate-400">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
