import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { LucideAngularModule, Mail, Lock, AlertCircle, Loader2 } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, AuthLayoutComponent, LucideAngularModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly AlertCircle = AlertCircle;
  readonly Loader2 = Loader2;

  formData = { email: '', password: '' };
  error = signal('');
  loading = signal(false);
  rememberMe = signal(false);

  async handleSubmit() {
    this.error.set('');
    this.loading.set(true);
    
    // Simulate slight delay for smooth interaction
    setTimeout(async () => {
        const result = await this.authService.login(this.formData.email, this.formData.password);
        if (result.success) {
          this.router.navigate(['/']);
        } else {
          this.error.set(result.message);
          this.loading.set(false);
        }
    }, 800);
  }
}
