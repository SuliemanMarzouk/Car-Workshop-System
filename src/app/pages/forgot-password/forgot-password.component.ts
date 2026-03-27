import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, Mail, ArrowLeft, AlertCircle, CheckCircle, Loader2 } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, LucideAngularModule, AuthLayoutComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private translate = inject(TranslateService);

  readonly Mail = Mail;
  readonly ArrowLeft = ArrowLeft;
  readonly AlertCircle = AlertCircle;
  readonly CheckCircle = CheckCircle;
  readonly Loader2 = Loader2;

  email = '';
  status = signal({ type: '', message: '' });
  loading = signal(false);

  async handleSubmit() {
    this.status.set({ type: '', message: '' });
    this.loading.set(true);

    // Simulate delay for UX
    setTimeout(async () => {
        const result = await this.authService.forgotPassword(this.email);
        this.loading.set(false);
        
        if (result.success) {
            this.status.set({ type: 'success', message: result.message });
            this.email = ''; // Clear email on success
        } else {
            this.status.set({ type: 'error', message: result.message });
        }
    }, 800);
  }

  isRtl() {
    return this.translate.currentLang === 'ar';
  }
}
