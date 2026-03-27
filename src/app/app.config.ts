import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { routes } from './app.routes';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { LucideAngularModule, Car, User, LogOut, Menu, X, Globe, LayoutDashboard, ClipboardList, Clock, Receipt, Users, Settings, Mail, Lock, AlertCircle, Loader2, CheckCircle, DollarSign, Plus, FileText, QrCode, Eye, Search, Trash2, Save, Download, Key, ArrowLeft, Shield, XCircle } from 'lucide-angular';

export class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient, private prefix: string = './assets/i18n/', private suffix: string = '.json') {}

  public getTranslation(lang: string): Observable<any> {
    return this.http.get(`${this.prefix}${lang}${this.suffix}`);
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        },
        defaultLanguage: 'en'
      }),
      LucideAngularModule.pick({ Car, User, LogOut, Menu, X, Globe, LayoutDashboard, ClipboardList, Clock, Receipt, Users, Settings, Mail, Lock, AlertCircle, Loader2, CheckCircle, DollarSign, Plus, FileText, QrCode, Eye, Search, Trash2, Save, Download, Key, ArrowLeft, Shield, XCircle })
    )
  ]
};
