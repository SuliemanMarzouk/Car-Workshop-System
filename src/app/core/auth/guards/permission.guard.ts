import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Permission } from '@core/auth/models/permission';
import { AuthService } from '@core/auth/services/auth.service';
import { PermissionService } from '@core/auth/services/permission.service';

export function permissionGuard(permission: Permission | string): CanActivateFn {
  return async () => {
    const auth = inject(AuthService);
    const permissions = inject(PermissionService);
    const router = inject(Router);

    const authenticated = await auth.ensureSession();

    if (!authenticated) {
      return router.createUrlTree(['/login']);
    }

    if (permissions.has(permission)) {
      return true;
    }

    return router.createUrlTree(['/forbidden']);
  };
}
