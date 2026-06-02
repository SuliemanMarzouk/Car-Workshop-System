import { Routes } from '@angular/router';
import { centralAuthGuard, centralPublicGuard } from './guards/central-auth.guard';
import { platformHostGuard } from './guards/platform-host.guard';

export const SAAS_ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/platform-login/platform-login.component').then((m) => m.PlatformLoginComponent),
    canActivate: [platformHostGuard, centralPublicGuard],
  },
  {
    path: '',
    loadComponent: () =>
      import('./ui/platform-shell/platform-shell.component').then((m) => m.PlatformShellComponent),
    canActivate: [platformHostGuard, centralAuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/platform-dashboard/platform-dashboard.component').then(
            (m) => m.PlatformDashboardComponent,
          ),
      },
      {
        path: 'tenants/:tenantId',
        loadComponent: () =>
          import('./pages/tenant-users/tenant-users.component').then((m) => m.TenantUsersComponent),
      },
      {
        path: 'tenants',
        loadComponent: () =>
          import('./pages/tenant-list/tenant-list.component').then((m) => m.TenantListComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
];
