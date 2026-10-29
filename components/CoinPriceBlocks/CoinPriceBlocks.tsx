"use client";

import { useEffect, useId, useState } from "react";
import Script from "next/script";

interface CoinPriceBlocksProps {
  coins?: string;
  currency?: string;
  theme?: "light" | "dark";
  transparent?: boolean;
  showSymbolLogo?: boolean;
  className?: string;
}

export default function CoinPriceBlocks({
  coins = "1,1027,825",
  currency = "USD",
  theme = "light",
  transparent = false,
  showSymbolLogo = true,
  className = "",
}: CoinPriceBlocksProps) {
  const generatedId = useId().replace(/:/g, "");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded) return;

    // Allow the external widget script to initialize after mount.
    const container = document.getElementById(
      `coinmarketcap-widget-${generatedId}`,
    );

    if (container) {
      container.setAttribute("coins", coins);
      container.setAttribute("currency", currency);
      container.setAttribute("theme", theme);
      container.setAttribute("transparent", String(transparent));
      container.setAttribute(
        "show-symbol-logo",
        String(showSymbolLogo),
      );
    }
  }, [
    scriptLoaded,
    generatedId,
    coins,
    currency,
    theme,
    transparent,
    showSymbolLogo,
  ]);

  return (
    <div className={`w-full ${className}`}>
      <Script
        src="https://files.coinmarketcap.com/static/widget/coinPriceBlock.js"
        strategy="afterInteractive"
        onReady={() => setScriptLoaded(true)}
      />

      <div
        id={`coinmarketcap-widget-${generatedId}`}
      />
    </div>
  );
}