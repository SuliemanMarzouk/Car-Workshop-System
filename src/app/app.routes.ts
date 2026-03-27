import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    canActivate: [publicGuard]
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'cars',
        loadComponent: () => import('./pages/cars/cars.component').then(m => m.CarsComponent)
      },
      {
        path: 'work-orders',
        loadComponent: () => import('./pages/work-orders/work-orders.component').then(m => m.WorkOrdersComponent)
      },
      {
        path: 'pending-approvals',
        loadComponent: () => import('./pages/pending-approvals/pending-approvals.component').then(m => m.PendingApprovalsComponent)
      },
      {
        path: 'invoices',
        loadComponent: () => import('./pages/invoices/invoices.component').then(m => m.InvoicesComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  }
];
