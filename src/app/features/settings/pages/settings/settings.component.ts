import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Save } from 'lucide-angular';
import { getDefaultWorkshopLogoDataUrl } from '@core/workshop/workshop-brand';
import { WorkshopProfileService } from '@core/workshop/workshop-profile.service';
import { WorkshopProfile } from '@core/workshop/workshop-profile.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  private readonly profileService = inject(WorkshopProfileService);

  readonly Save = Save;
  readonly saved = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly defaultLogo = getDefaultWorkshopLogoDataUrl();

  workshopName = '';
  logoDataUrl = '';
  logoPreview = '';
  address = '';
  city = '';
  country = '';
  phone = '';
  email = '';
  taxNumber = '';
  currency = 'USD';
  vatRatePercent = 15;
  emailNotifications = true;
  smsNotifications = false;

  async ngOnInit(): Promise<void> {
    await this.profileService.loadProfile();
    this.applyProfile(this.profileService.getProfile());
  }

  async save(): Promise<void> {
    this.saving.set(true);
    this.error.set(null);

    const payload: WorkshopProfile = {
      workshopName: this.workshopName,
      logoDataUrl: this.logoDataUrl || undefined,
      address: this.address,
      city: this.city,
      country: this.country,
      phone: this.phone,
      email: this.email,
      taxNumber: this.taxNumber,
      currency: this.currency,
      vatRate: this.vatRatePercent / 100,
      emailNotifications: this.emailNotifications,
      smsNotifications: this.smsNotifications,
    };

    try {
      await this.profileService.saveProfile(payload);
      this.applyProfile(this.profileService.getProfile());
      this.saved.set(true);
      setTimeout(() => this.saved.set(false), 3000);
    } catch {
      this.error.set('Failed to save settings.');
    } finally {
      this.saving.set(false);
    }
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      input.value = '';
      return;
    }
    if (file.size > 512_000) {
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      this.logoDataUrl = result;
      this.logoPreview = result;
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  removeLogo(): void {
    this.logoDataUrl = '';
    this.logoPreview = '';
  }

  private applyProfile(profile: WorkshopProfile): void {
    this.workshopName = profile.workshopName;
    this.logoDataUrl = profile.logoDataUrl ?? '';
    this.logoPreview = profile.logoDataUrl ?? '';
    this.address = profile.address;
    this.city = profile.city;
    this.country = profile.country;
    this.phone = profile.phone;
    this.email = profile.email;
    this.taxNumber = profile.taxNumber;
    this.currency = profile.currency;
    this.vatRatePercent = Math.round(profile.vatRate * 10000) / 100;
    this.emailNotifications = profile.emailNotifications;
    this.smsNotifications = profile.smsNotifications;
  }
}
