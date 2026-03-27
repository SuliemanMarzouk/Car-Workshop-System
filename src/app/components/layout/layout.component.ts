import { Component, inject, signal, effect } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { LucideAngularModule, Car, User, LogOut, Menu, X, Globe } from 'lucide-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, SidebarComponent, LucideAngularModule, TranslateModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  private translate = inject(TranslateService);
  private authService = inject(AuthService);
  
  readonly Car = Car;
  readonly User = User;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly X = X;
  readonly Globe = Globe;

  isSidebarOpen = signal(false);
  user = this.authService.user;
  currentLang = signal(this.translate.currentLang || 'en');

  constructor() {
    effect(() => {
      const lang = this.currentLang();
      document.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      this.translate.use(lang);
    });
  }

  toggleLanguage() {
    const newLang = this.currentLang() === 'en' ? 'ar' : 'en';
    this.currentLang.set(newLang);
  }

  logout() {
    this.authService.logout();
  }

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }
}
