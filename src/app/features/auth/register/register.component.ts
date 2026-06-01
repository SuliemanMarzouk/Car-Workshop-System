import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AlertCircle, Loader2, Lock, LucideAngularModule, Mail, User } from 'lucide-angular';
import { AuthService } from '@core/auth/services/auth.service';
import { AuthLayoutComponent } from '@core/layout/auth-layout/auth-layout.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, AuthLayoutComponent, LucideAngularModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly User = User;
  readonly AlertCircle = AlertCircle;
  readonly Loader2 = Loader2;

  formData = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  };

  readonly error = signal('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly fieldErrors = signal<any>({});
  readonly loading = signal(false);

  async handleSubmit(): Promise<void> {
    this.error.set('');
    this.fieldErrors.set({});

    if (this.formData.password !== this.formData.password_confirmation) {
      this.error.set('Passwords do not match');
      return;
    }

    this.loading.set(true);
    const result = await this.authService.register(this.formData);

    if (result.success) {
      await this.router.navigate(['/']);
      return;
    }

    this.error.set(result.message ?? '');
    if (result.errors) {
      this.fieldErrors.set(result.errors);
    }
    this.loading.set(false);
  }
}
