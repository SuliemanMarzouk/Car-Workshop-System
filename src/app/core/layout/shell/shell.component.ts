import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Car, Globe, LogOut, Menu, User, X } from 'lucide-angular';
import { AuthService } from '@core/auth/services/auth.service';
import { LanguageService } from '@core/i18n/language.service';
import { WorkshopProfileService } from '@core/workshop/workshop-profile.service';
import { SidebarComponent } from '@core/layout/sidebar/sidebar.component';
import { ThemeToggleComponent } from '@shared/ui/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    SidebarComponent,
    ThemeToggleComponent,
    LucideAngularModule,
    TranslateModule,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css',
})
export class ShellComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly workshopProfile = inject(WorkshopProfileService);
  readonly language = inject(LanguageService);

  ngOnInit(): void {
    void this.workshopProfile.loadProfile();
  }

  readonly Car = Car;
  readonly User = User;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly X = X;
  readonly Globe = Globe;

  readonly isSidebarOpen = signal(false);
  readonly user = this.authService.user;

  toggleLanguage(): void {
    this.language.toggle();
  }

  logout(): void {
    void this.authService.logout();
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update((value) => !value);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
