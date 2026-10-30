import Image from "next/image"
import Link from "next/link"
import type { AssetAllocationData } from "@/controller/deposit"

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

export default function AssetAllocation({
  assets,
  totalApprovedDeposits,
}: Pick<AssetAllocationData, "assets" | "totalApprovedDeposits">) {
  const assetItems = [
    {
      symbol: "BTC" as const,
      name: "Bitcoin",
      network: "BTC Mainnet",
      image: "/bitcoin.png",
      confirmations: "3 Confirms",
    },
    {
      symbol: "ETH" as const,
      name: "Ethereum",
      network: "ERC-20",
      image: "/ethereum.png",
      confirmations: "12 Confirms",
    },
    {
      symbol: "USDT" as const,
      name: "Tether USDT",
      network: "TRC-20 / ERC-20",
      image: "/usdt.png",
      confirmations: "Approved Deposits",
    },
  ]

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs lg:col-span-4">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-[#0F172A]">
              Asset Allocation
            </h4>

            <p className="text-xs text-[#64748B]">
              Approved cryptocurrency deposits
            </p>
          </div>

          <Image
            src="/24-hours.png"
            alt="Asset availability"
            width={512}
            height={512}
            className="h-8 w-8 object-contain"
          />
        </div>

        <div className="mb-4 hidden items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <span className="text-xs font-medium text-emerald-800">
            Total Approved Deposits
          </span>

          <span className="font-mono text-sm font-bold text-emerald-700">
            {totalApprovedDeposits}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          {assetItems.map((asset) => {
            const allocation = assets[asset.symbol]

            return (
              <div
                key={asset.symbol}
                className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                    <Image
                      src={asset.image}
                      alt={asset.name}
                      width={512}
                      height={512}
                      className="h-6 w-6 object-contain"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-600">
                      {asset.name}
                    </p>

                    <p className="text-[10px] text-gray-400">
                      {asset.network}
                    </p>

                    <p className="mt-1 text-[10px] text-emerald-600">
                      {allocation.count} approved{" "}
                      {allocation.count === 1 ? "deposit" : "deposits"}
                    </p>
                  </div>
                </div>

                <div className="ml-2 text-right">
                  <p className="font-mono text-xs font-bold text-gray-600">
                    {asset.symbol === "BTC"
                      ? `${formatCurrency(allocation.total)} BTC`
                      : asset.symbol === "ETH"
                        ? `${formatCurrency(allocation.total)} ETH`
                        : `${formatCurrency(allocation.total)} USDT`}
                  </p>

                  <p className="text-[10px] font-medium text-emerald-600">
                    Approved
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Link
        href="/dashboard/deposit"
        className="mt-6 block w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 text-center text-xs font-bold text-[#2563EB] transition-all hover:bg-[#2563EB] hover:text-white"
      >
        + Start New Investment
      </Link>
    </div>
  )
}