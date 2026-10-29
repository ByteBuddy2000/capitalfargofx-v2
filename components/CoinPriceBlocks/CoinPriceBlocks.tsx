// CoinPriceBlocks.tsx
"use client";

import { useEffect, useState } from "react";
import { getCryptoPrice } from "@/lib/coingecko";

type CryptoSymbol = "BTC" | "ETH" | "USDT";

interface CryptoAsset {
  symbol: CryptoSymbol;
  name: string;
  coingeckoId: string;
  icon: string;
}

interface CryptoCardProps {
  symbol: CryptoSymbol;
  name: string;
  price: number | null;
  loading: boolean;
  error: boolean;
}

const CRYPTO_ASSETS: CryptoAsset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    coingeckoId: "bitcoin",
    icon: "₿",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    coingeckoId: "ethereum",
    icon: "Ξ",
  },
  {
    symbol: "USDT",
    name: "Tether",
    coingeckoId: "tether",
    icon: "₮",
  },
];

function CryptoCard({
  symbol,
  name,
  price,
  loading,
  error,
}: CryptoCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-bold">
            {symbol === "BTC" ? (
              <span className="text-amber-500">{symbol === "BTC" ? "₿" : ""}</span>
            ) : symbol === "ETH" ? (
              <span className="text-indigo-500">Ξ</span>
            ) : (
              <span className="text-emerald-500">₮</span>
            )}
          </div>

          <div className="min-w-0">
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{symbol}</p>
          </div>
        </div>

        <div className="text-right">
          {loading ? (
            <div className="ml-auto h-5 w-24 animate-pulse rounded bg-muted" />
          ) : error || price === null ? (
            <p className="text-sm text-destructive">Unavailable</p>
          ) : (
            <p className="font-semibold tabular-nums">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: price < 1 ? 6 : 2,
              }).format(price)}
            </p>
          )}

          <p className="mt-1 text-xs text-muted-foreground">USD price</p>
        </div>
      </div>
    </div>
  );
}

export default function CoinPriceBlock() {
  const [prices, setPrices] = useState<
    Record<CryptoSymbol, number | null>
  >({
    BTC: null,
    ETH: null,
    USDT: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchPrices() {
      setLoading(true);
      setError(false);

      try {
        const results = await Promise.all(
          CRYPTO_ASSETS.map(async (asset) => ({
            symbol: asset.symbol,
            price: await getCryptoPrice(asset.coingeckoId, "usd"),
          })),
        );

        if (cancelled) return;

        setPrices({
          BTC: results.find((item) => item.symbol === "BTC")!.price,
          ETH: results.find((item) => item.symbol === "ETH")!.price,
          USDT: results.find((item) => item.symbol === "USDT")!.price,
        });
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchPrices();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Cryptocurrency Prices</h2>
        <p className="text-sm text-muted-foreground">
          Current market prices in USD
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CRYPTO_ASSETS.map((asset) => (
          <CryptoCard
            key={asset.symbol}
            symbol={asset.symbol}
            name={asset.name}
            price={prices[asset.symbol]}
            loading={loading}
            error={error}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-muted-foreground">
          Unable to load cryptocurrency prices. Check your connection and
          refresh the page.
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Prices are estimates and may differ from the final transaction rate.
        Data provided by CoinGecko.
      </p>
    </section>
  );
}