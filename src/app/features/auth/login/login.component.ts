import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AlertCircle, Loader2, Lock, LucideAngularModule, Mail } from 'lucide-angular';
import { AuthService } from '@core/auth/services/auth.service';
import { AuthLayoutComponent } from '@core/layout/auth-layout/auth-layout.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, AuthLayoutComponent, LucideAngularModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly AlertCircle = AlertCircle;
  readonly Loader2 = Loader2;

  formData = { email: '', password: '' };
  readonly error = signal('');
  readonly loading = signal(false);
  readonly rememberMe = signal(false);

  async handleSubmit(): Promise<void> {
    this.error.set('');
    this.loading.set(true);

    const result = await this.authService.login(this.formData.email, this.formData.password);

    if (result.success) {
      await this.router.navigate(['/']);
      return;
    }

    this.error.set(result.message ?? '');
    this.loading.set(false);
  }
}
