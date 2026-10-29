"use client"

import Script from "next/script"

interface CoinPriceHeadlineProps {
  coinIds?: string
  currency?: string
  outlined?: boolean
  className?: string
}

export default function CoinPriceHeadline({
  coinIds = "bitcoin,ethereum,tether",
  currency = "usd",
  outlined = true,
  className = "",
}: CoinPriceHeadlineProps) {
  return (
    <div className={`w-full ${className}`}>
      <Script
        src="https://widgets.coingecko.com/gecko-coin-price-static-headline-widget.js"
        strategy="afterInteractive"
      />

      <gecko-coin-price-static-headline-widget
        locale="en"
        outlined={String(outlined)}
        coin-ids={coinIds}
        initial-currency={currency}
      />
    </div>
  )
}
