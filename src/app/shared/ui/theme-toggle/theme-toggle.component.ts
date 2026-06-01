import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Moon, Sun } from 'lucide-angular';
import { ThemeService } from '@core/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [LucideAngularModule, TranslateModule],
  template: `
    <button
      type="button"
      (click)="theme.toggle()"
      class="toolbar-btn"
      [attr.aria-label]="(theme.isDark() ? 'theme.switch_light' : 'theme.switch_dark') | translate"
      [title]="(theme.isDark() ? 'theme.switch_light' : 'theme.switch_dark') | translate"
    >
      <lucide-icon
        [name]="theme.isDark() ? Sun : Moon"
        class="w-4 h-4 transition-transform duration-300"
        [class.rotate-90]="theme.isDark()"
      ></lucide-icon>
      <span class="hidden sm:inline">{{ (theme.isDark() ? 'theme.light' : 'theme.dark') | translate }}</span>
    </button>
  `,
})
export class ThemeToggleComponent {
  readonly theme = inject(ThemeService);
  readonly Sun = Sun;
  readonly Moon = Moon;
}
