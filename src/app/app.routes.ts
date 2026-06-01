import { Routes } from '@angular/router';
import { authGuard, publicGuard } from '@core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('@features/auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [publicGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('@features/auth/register/register.component').then((m) => m.RegisterComponent),
    canActivate: [publicGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('@features/auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
    canActivate: [publicGuard],
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('@features/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
    canActivate: [publicGuard],
  },
  {
    path: '',
    loadComponent: () =>
      import('@core/layout/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@features/dashboard/pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'cars',
        loadComponent: () =>
          import('@features/cars/pages/car-list/car-list.component').then((m) => m.CarListComponent),
      },
      {
        path: 'work-orders',
        loadComponent: () =>
          import('@features/work-orders/pages/work-order-list/work-order-list.component').then(
            (m) => m.WorkOrderListComponent,
          ),
      },
      {
        path: 'pending-approvals',
        loadComponent: () =>
          import(
            '@features/pending-approvals/pages/pending-approval-list/pending-approval-list.component'
          ).then((m) => m.PendingApprovalListComponent),
      },
      {
        path: 'invoices',
        loadComponent: () =>
          import('@features/invoices/pages/invoice-list/invoice-list.component').then(
            (m) => m.InvoiceListComponent,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('@features/users/pages/user-list/user-list.component').then(
            (m) => m.UserListComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('@features/settings/pages/settings/settings.component').then(
            (m) => m.SettingsComponent,
          ),
      },
    ],
  },
];
