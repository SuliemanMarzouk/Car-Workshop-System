import { Routes } from '@angular/router';
import { authGuard, publicGuard } from '@core/auth/guards/auth.guard';
import { permissionGuard } from '@core/auth/guards/permission.guard';
import { PERMISSIONS } from '@core/auth/models/permission';
import { workshopTenantGuard } from '@core/workshop/guards/workshop-tenant.guard';

export const routes: Routes = [
  {
    path: 'platform',
    loadChildren: () =>
      import('@features/saas-admin/saas-admin.routes').then((m) => m.SAAS_ADMIN_ROUTES),
  },
  {
    path: 'workshop-not-found',
    loadComponent: () =>
      import('@features/errors/pages/workshop-not-found/workshop-not-found.component').then(
        (m) => m.WorkshopNotFoundComponent,
      ),
  },
  {
    path: 'workshop-suspended',
    loadComponent: () =>
      import('@features/errors/pages/workshop-suspended/workshop-suspended.component').then(
        (m) => m.WorkshopSuspendedComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@features/auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [workshopTenantGuard, publicGuard],
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
    canActivate: [workshopTenantGuard, authGuard],
    children: [
      {
        path: 'forbidden',
        loadComponent: () =>
          import('@features/errors/pages/forbidden/forbidden.component').then(
            (m) => m.ForbiddenComponent,
          ),
      },
      {
        path: 'not-found',
        loadComponent: () =>
          import('@features/errors/pages/not-found/not-found.component').then(
            (m) => m.NotFoundComponent,
          ),
      },
      {
        path: '',
        loadComponent: () =>
          import('@features/dashboard/pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
        canActivate: [permissionGuard(PERMISSIONS.dashboardView)],
      },
      {
        path: 'cars',
        loadComponent: () =>
          import('@features/cars/pages/car-list/car-list.component').then((m) => m.CarListComponent),
        canActivate: [permissionGuard(PERMISSIONS.carsView)],
      },
      {
        path: 'work-orders',
        loadComponent: () =>
          import('@features/work-orders/pages/work-order-list/work-order-list.component').then(
            (m) => m.WorkOrderListComponent,
          ),
        canActivate: [permissionGuard(PERMISSIONS.workOrdersView)],
      },
      {
        path: 'pending-approvals',
        loadComponent: () =>
          import(
            '@features/pending-approvals/pages/pending-approval-list/pending-approval-list.component'
          ).then((m) => m.PendingApprovalListComponent),
        canActivate: [permissionGuard(PERMISSIONS.workOrdersApprove)],
      },
      {
        path: 'invoices',
        loadComponent: () =>
          import('@features/invoices/pages/invoice-list/invoice-list.component').then(
            (m) => m.InvoiceListComponent,
          ),
        canActivate: [permissionGuard(PERMISSIONS.invoicesView)],
      },
      {
        path: 'users',
        loadComponent: () =>
          import('@features/users/pages/user-list/user-list.component').then(
            (m) => m.UserListComponent,
          ),
        canActivate: [permissionGuard(PERMISSIONS.usersView)],
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('@features/roles/pages/role-list/role-list.component').then(
            (m) => m.RoleListComponent,
          ),
        canActivate: [permissionGuard(PERMISSIONS.rolesView)],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('@features/settings/pages/settings/settings.component').then(
            (m) => m.SettingsComponent,
          ),
        canActivate: [permissionGuard(PERMISSIONS.settingsView)],
      },
      {
        path: '**',
        loadComponent: () =>
          import('@features/errors/pages/not-found/not-found.component').then(
            (m) => m.NotFoundComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('@features/errors/pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
];
