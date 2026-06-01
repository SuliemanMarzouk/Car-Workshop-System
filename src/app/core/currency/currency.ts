export type CurrencyCode = 'USD' | 'SAR';

export interface CurrencyDefinition {
  code: CurrencyCode;
  /** Latin / foreign symbol shown beside amounts */
  symbol: string;
  /** Arabic UI symbol */
  symbolAr: string;
  /** Suggested rate: 1 USD → this many units (when base is USD) */
  defaultRateFromUsd?: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyDefinition> = {
  USD: {
    code: 'USD',
    symbol: '$',
    symbolAr: '$',
  },
  SAR: {
    code: 'SAR',
    symbol: 'SAR',
    symbolAr: 'ر.س',
    defaultRateFromUsd: 3.75,
  },
};

export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

export function isCurrencyCode(value: string): value is CurrencyCode {
  return value === 'USD' || value === 'SAR';
}

export function defaultExchangeRate(base: CurrencyCode, invoice: CurrencyCode): number {
  if (base === invoice) {
    return 1;
  }

  if (base === 'USD' && invoice === 'SAR') {
    return CURRENCIES.SAR.defaultRateFromUsd ?? 3.75;
  }

  if (base === 'SAR' && invoice === 'USD') {
    const sarPerUsd = CURRENCIES.SAR.defaultRateFromUsd ?? 3.75;
    return sarPerUsd > 0 ? Math.round((1 / sarPerUsd) * 1_000_000) / 1_000_000 : 1;
  }

  return 1;
}
