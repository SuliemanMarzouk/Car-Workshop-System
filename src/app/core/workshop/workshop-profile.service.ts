import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@core/auth/services/auth.service';
import { PERMISSIONS } from '@core/auth/models/permission';
import { PermissionService } from '@core/auth/services/permission.service';
import { CURRENCIES, isCurrencyCode } from '@core/currency/currency';
import { SettingsRepository } from '@features/settings/data/settings.repository';
import {
  UpdateWorkshopSettingsPayload,
  WorkshopConfig,
  WorkshopSettings,
} from '@features/settings/models/settings.model';
import { DEFAULT_WORKSHOP_PROFILE, WorkshopProfile } from './workshop-profile.model';

@Injectable({ providedIn: 'root' })
export class WorkshopProfileService {
  private readonly settingsRepository = inject(SettingsRepository);
  private readonly auth = inject(AuthService);
  private readonly permissions = inject(PermissionService);

  readonly profile = signal<WorkshopProfile>({ ...DEFAULT_WORKSHOP_PROFILE });
  readonly loading = signal(false);
  readonly loaded = signal(false);

  getProfile(): WorkshopProfile {
    return this.profile();
  }

  async loadProfile(): Promise<void> {
    if (!this.auth.isAuthenticated()) {
      return;
    }

    this.loading.set(true);

    try {
      if (this.permissions.has(PERMISSIONS.settingsView)) {
        const settings = await firstValueFrom(this.settingsRepository.getSettings());
        this.applySettings(settings);
      } else {
        const config = await firstValueFrom(this.settingsRepository.getWorkshopConfig());
        this.applyWorkshopConfig(config);
      }
      this.loaded.set(true);
    } catch {
      this.profile.set({ ...DEFAULT_WORKSHOP_PROFILE });
    } finally {
      this.loading.set(false);
    }
  }

  async saveProfile(profile: WorkshopProfile): Promise<WorkshopProfile> {
    const payload: UpdateWorkshopSettingsPayload = {
      workshop_name: profile.workshopName,
      logo_data_url: profile.logoDataUrl ?? null,
      address: profile.address,
      city: profile.city,
      country: profile.country,
      phone: profile.phone,
      email: profile.email,
      tax_number: profile.taxNumber,
      default_currency: profile.currency,
      vat_rate: profile.vatRate,
      email_notifications: profile.emailNotifications,
      sms_notifications: profile.smsNotifications,
    };

    const saved = await firstValueFrom(this.settingsRepository.updateSettings(payload));
    this.applySettings(saved);

    return this.profile();
  }

  /** @deprecated Use CurrencyService.symbol() */
  currencyLabel(currency: string, lang: 'ar' | 'en'): string {
    const code = isCurrencyCode(currency) ? currency : 'USD';
    const meta = CURRENCIES[code];
    return lang === 'ar' ? meta.symbolAr : meta.symbol;
  }

  private applySettings(settings: WorkshopSettings): void {
    this.profile.set(this.fromSettings(settings));
  }

  private applyWorkshopConfig(config: WorkshopConfig): void {
    const current = this.profile();
    this.profile.set({
      ...current,
      workshopName: config.workshop_name,
      logoDataUrl: config.logo_data_url ?? undefined,
      address: config.address,
      city: config.city,
      country: config.country,
      phone: config.phone,
      email: config.email,
      taxNumber: config.tax_number,
      currency: config.default_currency,
      vatRate: config.vat_rate,
    });
  }

  private fromSettings(settings: WorkshopSettings): WorkshopProfile {
    return {
      workshopName: settings.workshop_name,
      logoDataUrl: settings.logo_data_url ?? undefined,
      address: settings.address,
      city: settings.city,
      country: settings.country,
      phone: settings.phone,
      email: settings.email,
      taxNumber: settings.tax_number,
      currency: settings.default_currency,
      vatRate: settings.vat_rate,
      emailNotifications: settings.email_notifications,
      smsNotifications: settings.sms_notifications,
    };
  }
}
