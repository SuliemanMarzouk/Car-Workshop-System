import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CentralAuthService } from '../services/central-auth.service';

export const centralAuthGuard: CanActivateFn = async () => {
  const auth = inject(CentralAuthService);
  const router = inject(Router);

  if (!auth.token()) {
    return router.createUrlTree(['/platform/login']);
  }

  const ok = await auth.ensureSession();

  return ok ? true : router.createUrlTree(['/platform/login']);
};

export const centralPublicGuard: CanActivateFn = async () => {
  const auth = inject(CentralAuthService);
  const router = inject(Router);

  if (!auth.token()) {
    return true;
  }

  const ok = await auth.ensureSession();

  return ok ? router.createUrlTree(['/platform/dashboard']) : true;
};
