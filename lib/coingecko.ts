// /lib/coingecko.ts
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

export interface CryptoPriceOptions {
  cryptoId: string;
  fiatCurrency?: string;
}

export interface FiatToCryptoOptions extends CryptoPriceOptions {
  fiatAmount: number;
}

export interface CryptoConversion {
  cryptoId: string;
  fiatCurrency: string;
  fiatAmount: number;
  pricePerUnit: number;
  cryptoAmount: number;
}

/**
 * Returns the current price of a cryptocurrency in a fiat currency.
 * Example: getCryptoPrice("bitcoin", "usd")
 */
export async function getCryptoPrice(
  cryptoId: string,
  fiatCurrency = "usd",
): Promise<number> {
  if (!cryptoId.trim() || !fiatCurrency.trim()) {
    throw new Error("Crypto ID and fiat currency are required.");
  }

  const params = new URLSearchParams({
    ids: cryptoId.trim().toLowerCase(),
    vs_currencies: fiatCurrency.trim().toLowerCase(),
  });

  const response = await fetch(
    `${COINGECKO_API_URL}/simple/price?${params}`,
    {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!response.ok) {
    throw new Error(
      response.status === 429
        ? "CoinGecko rate limit exceeded. Please retry later."
        : `CoinGecko API error: ${response.status}`,
    );
  }

  const data: Record<string, Record<string, number>> =
    await response.json();

  const price =
    data[cryptoId.trim().toLowerCase()]?.[
      fiatCurrency.trim().toLowerCase()
    ];

  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
    throw new Error(
      `No valid price found for ${cryptoId} in ${fiatCurrency}.`,
    );
  }

  return price;
}

/**
 * Converts a fiat amount to cryptocurrency using its current quoted price.
 * Example: convertFiatToCrypto({
 *   cryptoId: "bitcoin",
 *   fiatCurrency: "usd",
 *   fiatAmount: 1000
 * })
 */
export async function convertFiatToCrypto({
  cryptoId,
  fiatCurrency = "usd",
  fiatAmount,
}: FiatToCryptoOptions): Promise<CryptoConversion> {
  if (!Number.isFinite(fiatAmount) || fiatAmount < 0) {
    throw new Error("Fiat amount must be a non-negative finite number.");
  }

  const normalizedCryptoId = cryptoId.trim().toLowerCase();
  const normalizedCurrency = fiatCurrency.trim().toLowerCase();

  const pricePerUnit = await getCryptoPrice(
    normalizedCryptoId,
    normalizedCurrency,
  );

  return {
    cryptoId: normalizedCryptoId,
    fiatCurrency: normalizedCurrency,
    fiatAmount,
    pricePerUnit,
    cryptoAmount: fiatAmount / pricePerUnit,
  };
}
