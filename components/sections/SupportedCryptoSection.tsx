import React from "react"
import Image from "next/image"
import { SUPPORTED_CRYPTOS } from "../../lib/data"
import { ShieldCheck, Lock } from "lucide-react"

const cryptoImages: Record<string, string> = {
  BTC: "/bitcoin.png",
  ETH: "/ethereum.png",
  USDT: "/usdt.png",
}

export const SupportedCryptoSection: React.FC = () => {
  return (
    <section
      id="crypto-settlement-rails-section"
      className="bg-slate-950/80 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-3.5 py-1 font-mono text-xs font-bold tracking-wider text-emerald-300 uppercase">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Cryptocurrency Settlement Rails</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Cryptocurrency Settlement Rails
          </h2>

          <p className="text-base text-slate-300">
            Seamless deposits and withdrawals backed by multi-signature cold
            custody.
          </p>
        </div>

        {/* Crypto Rails Cards (Horizontal scroll on mobile, 3-col grid on desktop) */}
        <div className="no-scrollbar flex snap-x snap-mandatory space-x-5 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:space-x-0">
          {SUPPORTED_CRYPTOS.map((crypto) => (
            <div
              key={crypto.symbol}
              id={`crypto-rail-${crypto.symbol.toLowerCase()}`}
              className="group flex w-70 shrink-0 snap-center flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-emerald-500/40 hover:shadow-xl sm:w-[320px] sm:p-8 md:w-auto"
            >
              <div>
                {/* Header with symbol and badge */}
                <div className="relative mb-6 flex items-center justify-between">
                  <div className="relative flex items-center gap-3">
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-800 shadow-md">
                      <Image
                        src={cryptoImages[crypto.symbol]}
                        alt={`${crypto.name} icon`}
                        fill
                        sizes="48px"
                        className="object-contain p-2"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {crypto.name}
                      </h3>
                      <span className="font-mono text-xs font-semibold text-slate-400">
                        {crypto.symbol}
                      </span>
                    </div>
                    
                  </div>

                  
                </div>

                {/* Technical Specifications */}
                <div className="space-y-3 border-y border-slate-800 py-4 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-sans text-slate-400">
                      Settlement Network:
                    </span>
                    <span className="max-w-42.5 truncate text-right font-bold text-slate-200">
                      {crypto.network}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-sans text-slate-400">
                      Deposit Fee:
                    </span>
                    <span className="font-bold text-emerald-400">
                      {crypto.depositFee}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-sans text-slate-400">
                      Confirmation Speed:
                    </span>
                    <span className="font-bold text-blue-400">
                      {crypto.confirmationSpeed}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                  <Lock className="h-3.5 w-3.5 text-slate-500" />
                  <span>Multi-Signature Cold Storage Protocol</span>
                </div>
              </div>
               <span className="absolute top-1 right-2.5 rounded-full border border-slate-700/50 bg-slate-800 px-2 py-1 font-mono text-[10px] font-semibold text-slate-300">
                    Native Tier
                  </span>

              <div className="mt-6 border-t border-slate-800 pt-4">
                <div className="font-mono text-[10px] text-slate-400">
                  Status:{" "}
                  <span className="font-bold text-emerald-400">
                    Rail Operational
                  </span>{" "}
                  · Zero Deposit Fees
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          <p>
            *All digital asset transactions require on-chain verification
            according to standard cryptographic consensus rules.
          </p>
        </div>
      </div>
    </section>
  )
}
