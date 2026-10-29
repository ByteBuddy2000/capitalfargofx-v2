// CoinPriceMarquee.tsx
"use client";

import Script from "next/script";

type CoinPriceMarqueeProps = {
  coinIds?: string;
  currency?: string;
  darkMode?: boolean;
  transparentBackground?: boolean;
  outlined?: boolean;
  className?: string;
};

export default function CoinPriceMarquee({
  coinIds = "bitcoin,ethereum,tether,solana,ripple",
  currency = "usd",
  darkMode = true,
  transparentBackground = false,
  outlined = true,
  className = "fixed top-0 left-0 z-50",
}: CoinPriceMarqueeProps) {
  return (
    <div className={` w-full overflow-hidden ${className}`}>
      <Script
        src="https://widgets.coingecko.com/gecko-coin-price-marquee-widget.js"
        strategy="afterInteractive"
      />

      <gecko-coin-price-marquee-widget
        locale="en"
        coin-ids={coinIds}
        initial-currency={currency}
        dark-mode={String(darkMode)}
        transparent-background={String(transparentBackground)}
        outlined={String(outlined)}
      />
    </div>
  );
}