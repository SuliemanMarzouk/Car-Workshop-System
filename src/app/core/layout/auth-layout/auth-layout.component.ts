import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Car, Globe } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@core/i18n/language.service';
import { ThemeToggleComponent } from '@shared/ui/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TranslateModule, ThemeToggleComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {
  @Input() title = '';
  @Input() subtitle = '';

  readonly language = inject(LanguageService);

  readonly Car = Car;
  readonly Globe = Globe;
  readonly currentYear = new Date().getFullYear();

  toggleLanguage(): void {
    this.language.toggle();
  }
}
