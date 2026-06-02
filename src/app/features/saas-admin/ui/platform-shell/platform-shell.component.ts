import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  LayoutDashboard,
  LogOut,
  LucideAngularModule,
  Menu,
  Shield,
  Users,
  X,
} from 'lucide-angular';
import { CentralAuthService } from '../../services/central-auth.service';
import { ThemeToggleComponent } from '@shared/ui/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-platform-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    LucideAngularModule,
    ThemeToggleComponent,
  ],
  templateUrl: './platform-shell.component.html',
  styleUrl: '../../styles/platform.scss',
})
export class PlatformShellComponent {
  private readonly centralAuth = inject(CentralAuthService);

  readonly LayoutDashboard = LayoutDashboard;
  readonly Users = Users;
  readonly LogOut = LogOut;
  readonly Shield = Shield;
  readonly Menu = Menu;
  readonly X = X;

  readonly user = this.centralAuth.user;
  readonly mobileNavOpen = signal(false);

  userInitials(): string {
    const name = this.user()?.name?.trim() ?? '';
    if (!name) {
      return 'PA';
    }

    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  toggleMobileNav(): void {
    this.mobileNavOpen.update((open) => !open);
  }

  closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }

  logout(): void {
    void this.centralAuth.logout();
  }
}
