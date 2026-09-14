import React from "react"
import { motion } from "motion/react"
import { Coins, CheckCircle2, Zap } from "lucide-react"
import { CryptoWalletConfig } from "../../types"
import { storage } from "../../lib/storage"

interface CryptoAssetsProps {
  wallets?: CryptoWalletConfig[]
}

export const CryptoAssets: React.FC<CryptoAssetsProps> = ({ wallets }) => {
  const currentWallets = wallets || storage.getWallets()
  const assetDetails = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      network: "Bitcoin Core / Native SegWit",
      color:
        "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-500",
      iconText: "₿",
      rate: "$64,280.00",
      change24h: "+2.84%",
      status: "Instant Deposit & Withdrawal",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      network: "ERC-20 (Ethereum Mainnet)",
      color: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-500",
      iconText: "Ξ",
      rate: "$3,485.50",
      change24h: "+4.12%",
      status: "Instant Deposit & Withdrawal",
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      network: "ERC-20 / TRC-20 Compatible",
      color:
        "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-500",
      iconText: "₮",
      rate: "$1.00 USD",
      change24h: "0.00%",
      status: "Instant Deposit & Withdrawal",
    },
  ]

  return (
    <section id="assets" className="bg-slate-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-bold tracking-wider text-slate-300 uppercase">
              <Coins className="h-4 w-4 text-emerald-400" />
              Supported Digital Assets
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Cryptocurrency Settlement Rails
            </h2>
            <p className="mt-2 max-w-xl text-base text-slate-400">
              We provide seamless cross-chain deposits and withdrawals backed by
              multi-signature cold custody.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {assetDetails.map((asset, idx) => (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/90 p-8 transition-all hover:border-slate-700"
            >
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${asset.color} flex items-center justify-center border text-2xl font-black`}
                    >
                      {asset.iconText}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {asset.name}
                      </h3>
                      <p className="font-mono text-xs text-slate-400">
                        {asset.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-bold text-white">
                      {asset.rate}
                    </p>
                    <p className="text-[11px] font-semibold text-emerald-400">
                      {asset.change24h}
                    </p>
                  </div>
                </div>

                <div className="mb-6 space-y-2.5 rounded-xl border border-slate-800/80 bg-slate-950 p-4 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Settlement Network:</span>
                    <span className="font-semibold text-slate-300">
                      {asset.network}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Deposit Fee:</span>
                    <span className="font-bold text-emerald-400">0.00%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Confirmation Speed:</span>
                    <span className="font-semibold text-white">
                      Instant / 1 Confirmation
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-slate-800 pt-4 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{asset.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
