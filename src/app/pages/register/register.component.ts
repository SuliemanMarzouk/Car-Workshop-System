import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { LucideAngularModule, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, AuthLayoutComponent, LucideAngularModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly User = User;
  readonly AlertCircle = AlertCircle;
  readonly Loader2 = Loader2;

  formData = { 
    name: '',
    email: '', 
    password: '',
    password_confirmation: '' 
  };
  error = signal('');
  fieldErrors = signal<any>({});
  loading = signal(false);

  async handleSubmit() {
    this.error.set('');
    this.fieldErrors.set({});
    
    if (this.formData.password !== this.formData.password_confirmation) {
        this.error.set('Passwords do not match');
        return;
    }

    this.loading.set(true);

    // Simulate slight delay for smooth interaction
    setTimeout(async () => {
        const result = await this.authService.register(this.formData);
        if (result.success) {
          this.router.navigate(['/']);
        } else {
          this.error.set(result.message);
          if (result.errors) {
              this.fieldErrors.set(result.errors);
          }
          this.loading.set(false);
        }
    }, 800);
  }
}
