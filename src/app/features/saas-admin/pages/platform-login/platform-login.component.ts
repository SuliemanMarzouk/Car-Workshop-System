import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  AlertCircle,
  Loader2,
  Lock,
  LucideAngularModule,
  Mail,
  Shield,
  Sparkles,
} from 'lucide-angular';
import { CentralAuthService } from '../../services/central-auth.service';

@Component({
  selector: 'app-platform-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
  templateUrl: './platform-login.component.html',
  styleUrl: '../../styles/platform-content.scss',
})
export class PlatformLoginComponent {
  private readonly centralAuth = inject(CentralAuthService);
  private readonly router = inject(Router);

  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly AlertCircle = AlertCircle;
  readonly Loader2 = Loader2;
  readonly Shield = Shield;
  readonly Sparkles = Sparkles;

  formData = { email: '', password: '' };
  readonly error = signal('');
  readonly loading = signal(false);

  async handleSubmit(): Promise<void> {
    this.error.set('');
    this.loading.set(true);

    const result = await this.centralAuth.login(this.formData.email, this.formData.password);

    if (result.success) {
      await this.router.navigate(['/platform/dashboard']);
      return;
    }

    this.error.set(result.message ?? '');
    this.loading.set(false);
  }
}
