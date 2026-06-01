import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AlertCircle, CheckCircle, Loader2, Lock, LucideAngularModule } from 'lucide-angular';
import { AuthService } from '@core/auth/services/auth.service';
import { AuthLayoutComponent } from '@core/layout/auth-layout/auth-layout.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule, AuthLayoutComponent],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly Lock = Lock;
  readonly AlertCircle = AlertCircle;
  readonly CheckCircle = CheckCircle;
  readonly Loader2 = Loader2;

  formData = {
    token: '',
    email: '',
    password: '',
    password_confirmation: '',
  };

  readonly status = signal({ type: '', message: '' });
  readonly loading = signal(false);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['token'] && params['email']) {
        this.formData.token = params['token'];
        this.formData.email = params['email'];
      }
    });
  }

  async handleSubmit(): Promise<void> {
    this.status.set({ type: '', message: '' });

    if (this.formData.password !== this.formData.password_confirmation) {
      this.status.set({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    this.loading.set(true);
    const result = await this.authService.resetPassword(this.formData);
    this.loading.set(false);

    if (result.success) {
      this.status.set({ type: 'success', message: result.message ?? '' });
      setTimeout(() => {
        void this.router.navigate(['/login']);
      }, 2000);
      return;
    }

    this.status.set({ type: 'error', message: result.message ?? '' });
  }
}
