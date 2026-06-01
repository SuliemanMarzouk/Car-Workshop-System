import { Injectable, computed, inject } from '@angular/core';
import { LanguageService } from '@core/i18n/language.service';
import { WorkshopProfileService } from '@core/workshop/workshop-profile.service';
import {
  CurrencyCode,
  CURRENCIES,
  defaultExchangeRate,
  isCurrencyCode,
} from './currency';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private readonly profileService = inject(WorkshopProfileService);
  private readonly language = inject(LanguageService);

  readonly systemCurrency = computed((): CurrencyCode => {
    const profile = this.profileService.profile();
    return isCurrencyCode(profile.currency) ? profile.currency : 'USD';
  });

  symbol(code: string, lang?: 'ar' | 'en'): string {
    const resolved = isCurrencyCode(code) ? code : 'USD';
    const meta = CURRENCIES[resolved];
    const language = lang ?? this.language.language();
    return language === 'ar' ? meta.symbolAr : meta.symbol;
  }

  formatAmount(value: number, code: string, lang?: 'ar' | 'en'): string {
    const amount = value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${amount} ${this.symbol(code, lang)}`;
  }

  formatAmountParts(value: number, code: string): { amount: string; symbol: string } {
    return {
      amount: value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      symbol: this.symbol(code),
    };
  }

  resolveInvoiceCurrency(invoice: {
    currency?: string | null;
  }): CurrencyCode {
    if (invoice.currency && isCurrencyCode(invoice.currency)) {
      return invoice.currency;
    }
    return this.systemCurrency();
  }

  suggestedExchangeRate(base: CurrencyCode, invoice: CurrencyCode): number {
    return defaultExchangeRate(base, invoice);
  }

  labelKey(code: CurrencyCode): string {
    return code === 'SAR' ? 'settings.currency_sar' : 'settings.currency_usd';
  }
}
