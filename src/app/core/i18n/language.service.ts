import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'ar' | 'en';

const STORAGE_KEY = 'workshop-lang';
const DEFAULT_LANGUAGE: AppLanguage = 'ar';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);

  readonly language = signal<AppLanguage>(this.readStored());

  constructor() {
    this.apply(this.language());
  }

  setLanguage(lang: AppLanguage): void {
    if (this.language() === lang) {
      return;
    }

    this.language.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    this.apply(lang);
  }

  toggle(): void {
    this.setLanguage(this.language() === 'ar' ? 'en' : 'ar');
  }

  isArabic(): boolean {
    return this.language() === 'ar';
  }

  private readStored(): AppLanguage {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored === 'ar' || stored === 'en') {
      return stored;
    }

    return DEFAULT_LANGUAGE;
  }

  private apply(lang: AppLanguage): void {
    document.documentElement.lang = lang;
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    this.translate.use(lang);
  }
}
