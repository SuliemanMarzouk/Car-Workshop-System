import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Lock, AlertCircle, CheckCircle, Loader2 } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, LucideAngularModule, AuthLayoutComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly Lock = Lock;
  readonly AlertCircle = AlertCircle;
  readonly CheckCircle = CheckCircle;
  readonly Loader2 = Loader2;

  formData = { 
    token: '',
    email: '',
    password: '',
    password_confirmation: '' 
  };
  status = signal({ type: '', message: '' });
  loading = signal(false);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const email = params['email'];
      if (token && email) {
          this.formData.token = token;
          this.formData.email = email;
      }
    });
  }

  async handleSubmit() {
    this.status.set({ type: '', message: '' });

    if (this.formData.password !== this.formData.password_confirmation) {
        this.status.set({ type: 'error', message: 'Passwords do not match' });
        return;
    }

    this.loading.set(true);
    
    // Simulate delay
    setTimeout(async () => {
        const result = await this.authService.resetPassword(this.formData);
        this.loading.set(false);

        if (result.success) {
            this.status.set({ type: 'success', message: result.message });
            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 2000);
        } else {
            this.status.set({ type: 'error', message: result.message });
        }
    }, 800);
  }
}
