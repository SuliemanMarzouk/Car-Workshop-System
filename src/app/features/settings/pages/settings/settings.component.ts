import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Save } from 'lucide-angular';
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

  workshopName = '';
  address = '';
  city = '';
  country = '';
  phone = '';
  email = '';
  taxNumber = '';
  currency = 'SAR';
  emailNotifications = true;
  smsNotifications = false;

  ngOnInit(): void {
    const profile = this.profileService.getProfile();
    this.applyProfile(profile);
  }

  save(): void {
    const payload: WorkshopProfile = {
      workshopName: this.workshopName,
      address: this.address,
      city: this.city,
      country: this.country,
      phone: this.phone,
      email: this.email,
      taxNumber: this.taxNumber,
      currency: this.currency,
      emailNotifications: this.emailNotifications,
      smsNotifications: this.smsNotifications,
    };
    this.profileService.saveProfile(payload);
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }

  private applyProfile(profile: WorkshopProfile): void {
    this.workshopName = profile.workshopName;
    this.address = profile.address;
    this.city = profile.city;
    this.country = profile.country;
    this.phone = profile.phone;
    this.email = profile.email;
    this.taxNumber = profile.taxNumber;
    this.currency = profile.currency;
    this.emailNotifications = profile.emailNotifications;
    this.smsNotifications = profile.smsNotifications;
  }
}
