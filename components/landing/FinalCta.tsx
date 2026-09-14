import React from "react"
import { ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react"
import { Button } from "../ui/Button"

interface FinalCtaProps {
  onOpenRegister?: () => void
  onOpenLogin?: () => void
}

export const FinalCta: React.FC<FinalCtaProps> = ({
  onOpenRegister,
  onOpenLogin,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-[350px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-600/20 via-emerald-600/20 to-teal-600/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
          <ShieldCheck className="h-4 w-4" />
          Institutional Capital Deployment
        </div>

        <h2 className="mb-6 text-3xl leading-tight font-black tracking-tight text-white sm:text-5xl">
          Start Managing Your Investment Journey Today
        </h2>

        <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Create your verified investor account, explore structured
          cryptocurrency investment plans, and experience dependable digital
          market liquidity.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            variant="primary"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            onClick={onOpenRegister}
            className="w-full border-none bg-gradient-to-r from-blue-600 to-emerald-600 px-8 py-3.5 text-base font-bold shadow-xl shadow-blue-500/20 hover:from-blue-700 hover:to-emerald-700 sm:w-auto"
          >
            Create Account
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onOpenLogin}
            className="w-full border-slate-700 bg-slate-900 px-8 py-3.5 text-white hover:bg-slate-800 sm:w-auto"
          >
            Login to Dashboard
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            No account opening fees
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Zero deposit transaction charges
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            24/7 account monitoring
          </span>
        </div>
      </div>
    </section>
  )
}
