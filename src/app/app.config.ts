import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  AlertCircle,
  ArrowLeft,
  Car,
  CheckCircle,
  ClipboardList,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  Globe,
  Key,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  LucideAngularModule,
  Mail,
  Menu,
  Plus,
  QrCode,
  Receipt,
  Save,
  Search,
  Settings,
  Shield,
  Trash2,
  User,
  Users,
  X,
  XCircle,
} from 'lucide-angular';
import { API_BASE_URL } from '@core/config/api.config';
import { httpLoaderFactory } from '@core/i18n/custom-translate.loader';
import { tokenInterceptor } from '@core/auth/interceptors/token.interceptor';
import { environment } from '@env/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: API_BASE_URL, useValue: environment.apiUrl },
    provideHttpClient(withInterceptors([tokenInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
        defaultLanguage: 'ar',
      }),
      LucideAngularModule.pick({
        Car,
        User,
        LogOut,
        Menu,
        X,
        Globe,
        LayoutDashboard,
        ClipboardList,
        Clock,
        Receipt,
        Users,
        Settings,
        Mail,
        Lock,
        AlertCircle,
        Loader2,
        CheckCircle,
        DollarSign,
        Plus,
        FileText,
        QrCode,
        Eye,
        Search,
        Trash2,
        Save,
        Download,
        Key,
        ArrowLeft,
        Shield,
        XCircle,
        Filter,
      }),
    ),
  ],
};
