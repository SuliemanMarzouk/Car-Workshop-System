import { Injectable } from '@angular/core';
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

  currencyLabel(currency: string, lang: 'ar' | 'en'): string {
    if (currency === 'SAR') {
      return lang === 'ar' ? 'ر.س' : 'SAR';
    }
    if (currency === 'USD') {
      return lang === 'ar' ? 'د.أ' : 'USD';
    }
    return currency;
  }
}
