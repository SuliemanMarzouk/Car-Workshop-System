import { Component, Input, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Car, Globe } from 'lucide-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TranslateModule],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';

  private translate = inject(TranslateService);
  
  readonly Car = Car;
  readonly Globe = Globe;
  
  currentLang = signal(this.translate.currentLang || 'en');
  currentYear = new Date().getFullYear();

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
}
