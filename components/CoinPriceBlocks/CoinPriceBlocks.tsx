// components/CoinPriceBlock.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bitcoin, Coins, RefreshCw } from "lucide-react";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

type CryptoId = "bitcoin" | "ethereum" | "tether";

interface CoinPriceResponse {
  bitcoin?: { usd?: number };
  ethereum?: { usd?: number };
  tether?: { usd?: number };
}

interface CryptoAsset {
  id: CryptoId;
  symbol: string;
  name: string;
  price: number | null;
}

interface CryptoCardProps {
  name: string;
  symbol: string;
  price: number | null;
  currency?: string;
  loading?: boolean;
  index: number;
}

const INITIAL_ASSETS: CryptoAsset[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: null },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", price: null },
  { id: "tether", symbol: "USDT", name: "Tether", price: null },
];

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

function CryptoIcon({ symbol }: { symbol: string }) {
  if (symbol === "BTC") {
    return <Bitcoin className="h-6 w-6 text-amber-400" />;
  }

  if (symbol === "ETH") {
    return <Coins className="h-6 w-6 text-blue-400" />;
  }

  return <Coins className="h-6 w-6 text-emerald-400" />;
}

function CryptoCard({
  name,
  symbol,
  price,
  currency = "USD",
  loading = false,
  index,
}: CryptoCardProps) {
  const formattedPrice =
    price === null
      ? "—"
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: price < 1 ? 6 : 2,
        }).format(price);

  return (
    <motion.article
      variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
      className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm transition-colors duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-950/20"
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/5 blur-2xl transition-colors duration-300 group-hover:bg-blue-500/10" />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800 transition-colors duration-300 group-hover:bg-slate-800/80">
            <CryptoIcon symbol={symbol} />
          </div>

          <div>
            <h3 className="font-semibold text-white">{name}</h3>
            <p className="text-sm text-slate-400">{symbol}</p>
          </div>
        </div>

        <span className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 font-mono text-xs font-medium text-slate-300">
          {symbol}
        </span>
      </div>

      <div className="relative mt-7 border-t border-slate-800 pt-5">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Current price
        </p>

        {loading && price === null ? (
          <div
            aria-label={`Loading ${name} price`}
            className="mt-3 h-8 w-36 animate-pulse rounded-md bg-slate-800"
          />
        ) : (
          <p className="mt-2 break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {formattedPrice}
          </p>
        )}

        <p className="mt-2 text-xs text-slate-500">
          Per 1 {symbol}
        </p>
      </div>
    </motion.article>
  );
}

export default function CoinPriceBlocks() {
  const [assets, setAssets] = useState<CryptoAsset[]>(INITIAL_ASSETS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPrices() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          ids: "bitcoin,ethereum,tether",
          vs_currencies: "usd",
        });

        const response = await fetch(
          `${COINGECKO_API_URL}/simple/price?${params.toString()}`,
          {
            headers: { Accept: "application/json" },
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            response.status === 429
              ? "CoinGecko rate limit exceeded. Please try again later."
              : `Unable to fetch cryptocurrency prices (${response.status}).`,
          );
        }

        const data: CoinPriceResponse = await response.json();

        const prices: Record<CryptoId, number | null> = {
          bitcoin: data.bitcoin?.usd ?? null,
          ethereum: data.ethereum?.usd ?? null,
          tether: data.tether?.usd ?? null,
        };

        if (
          Object.values(prices).some(
            (price) =>
              price === null ||
              !Number.isFinite(price) ||
              price <= 0,
          )
        ) {
          throw new Error("CoinGecko returned incomplete price data.");
        }

        setAssets((current) =>
          current.map((asset) => ({
            ...asset,
            price: prices[asset.id],
          })),
        );
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while fetching prices.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchPrices();

    return () => controller.abort();
  }, []);

  return (
    <section
      id="crypto-prices-section"
      className="overflow-hidden border-b border-slate-800 bg-slate-900/40 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Introduction */}
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-12 max-w-3xl space-y-4 text-left"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-blue-300">
            Digital Asset Market
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Cryptocurrency Prices
            </h2>

            {loading && (
              <span className="inline-flex items-center gap-2 text-sm text-slate-400">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Loading prices...
              </span>
            )}
          </div>

          <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
            Monitor the latest available market prices for Bitcoin,
            Ethereum, and Tether in USD. Prices are retrieved from
            CoinGecko and may fluctuate with market conditions.
          </p>
        </motion.div>

        {/* Cryptocurrency Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {assets.map((asset, index) => (
            <CryptoCard
              key={asset.id}
              name={asset.name}
              symbol={asset.symbol}
              price={asset.price}
              currency="USD"
              loading={loading}
              index={index}
            />
          ))}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            role="alert"
            className="mb-6 rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-300"
          >
            {error}
          </motion.div>
        )}

        {/* Data Attribution */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-xs leading-relaxed text-slate-500"
        >
          Market data provided by{" "}
          <a
            href="https://www.coingecko.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition-colors hover:text-blue-400"
          >
            CoinGecko
          </a>
          . Prices are indicative and may change. This section does not
          automatically refresh prices after the initial request.
        </motion.p>
      </div>
    </section>
  );
}