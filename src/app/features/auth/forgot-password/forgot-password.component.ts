import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@core/i18n/language.service';
import { AlertCircle, ArrowLeft, CheckCircle, Loader2, LucideAngularModule, Mail } from 'lucide-angular';
import { AuthService } from '@core/auth/services/auth.service';
import { AuthLayoutComponent } from '@core/layout/auth-layout/auth-layout.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, LucideAngularModule, AuthLayoutComponent],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly language = inject(LanguageService);

  readonly Mail = Mail;
  readonly ArrowLeft = ArrowLeft;
  readonly AlertCircle = AlertCircle;
  readonly CheckCircle = CheckCircle;
  readonly Loader2 = Loader2;

  email = '';
  readonly status = signal({ type: '', message: '' });
  readonly loading = signal(false);

  async handleSubmit(): Promise<void> {
    this.status.set({ type: '', message: '' });
    this.loading.set(true);

    const result = await this.authService.forgotPassword(this.email);
    this.loading.set(false);

    if (result.success) {
      this.status.set({ type: 'success', message: result.message ?? '' });
      this.email = '';
      return;
    }

    this.status.set({ type: 'error', message: result.message ?? '' });
  }

  isRtl(): boolean {
    return this.language.isArabic();
  }
}
