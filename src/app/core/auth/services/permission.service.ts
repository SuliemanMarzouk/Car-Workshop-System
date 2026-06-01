import { Injectable, inject } from '@angular/core';
import { AuthService } from '@core/auth/services/auth.service';
import { PERMISSIONS, Permission } from '@core/auth/models/permission';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly auth = inject(AuthService);

  has(permission: Permission | string): boolean {
    const user = this.auth.user();
    const list = user?.permissions;

    if (!list?.length) {
      return false;
    }

    return list.includes(permission);
  }

  hasAny(...permissions: (Permission | string)[]): boolean {
    return permissions.some((p) => this.has(p));
  }

  hasAll(...permissions: (Permission | string)[]): boolean {
    return permissions.every((p) => this.has(p));
  }

  /** First route the user may access (for error-page "home" button). */
  defaultRoute(): string {
    const order: { route: string; permission: Permission | string }[] = [
      { route: '/', permission: PERMISSIONS.dashboardView },
      { route: '/cars', permission: PERMISSIONS.carsView },
      { route: '/work-orders', permission: PERMISSIONS.workOrdersView },
      { route: '/pending-approvals', permission: PERMISSIONS.workOrdersApprove },
      { route: '/invoices', permission: PERMISSIONS.invoicesView },
      { route: '/users', permission: PERMISSIONS.usersView },
      { route: '/roles', permission: PERMISSIONS.rolesView },
      { route: '/settings', permission: PERMISSIONS.settingsView },
    ];

    const match = order.find((item) => this.has(item.permission));

    return match?.route ?? '/login';
  }
}
