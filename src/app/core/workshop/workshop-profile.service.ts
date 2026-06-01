import { Injectable } from '@angular/core';
import { CURRENCIES, isCurrencyCode } from '@core/currency/currency';
import { DEFAULT_WORKSHOP_PROFILE, WorkshopProfile } from './workshop-profile.model';

const STORAGE_KEY = 'workshop-settings';

@Injectable({ providedIn: 'root' })
export class WorkshopProfileService {
  getProfile(): WorkshopProfile {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_WORKSHOP_PROFILE };
    }

    try {
      return { ...DEFAULT_WORKSHOP_PROFILE, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_WORKSHOP_PROFILE };
    }
  }

  saveProfile(profile: WorkshopProfile): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  /** @deprecated Use CurrencyService.symbol() */
  currencyLabel(currency: string, lang: 'ar' | 'en'): string {
    const code = isCurrencyCode(currency) ? currency : 'USD';
    const meta = CURRENCIES[code];
    return lang === 'ar' ? meta.symbolAr : meta.symbol;
  }
}
