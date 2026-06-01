import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Mail, Shield, User } from 'lucide-angular';
import { AuthService } from '@core/auth/services/auth.service';
import { AuthUser } from '@core/auth/models/auth-session.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  private readonly authService = inject(AuthService);

  readonly User = User;
  readonly Shield = Shield;
  readonly Mail = Mail;

  readonly users = signal<AuthUser[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    const current = this.authService.user();
    if (current) {
      this.users.set([current]);
    }
    this.loading.set(false);
  }
}
