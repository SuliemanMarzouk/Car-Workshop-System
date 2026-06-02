import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {
  isPlatformBrowserContext,
  resolveTenantKeyFromHostnameOnly,
  resolveWorkshopTenantKey,
  setWorkshopTenantKey,
} from '../tenant-context';
import { WorkshopResolveService } from '../workshop-resolve.service';

export const workshopTenantGuard: CanActivateFn = async () => {
  if (isPlatformBrowserContext()) {
    return true;
  }

  const router = inject(Router);
  const resolver = inject(WorkshopResolveService);

  const tenantKey = resolveWorkshopTenantKey();
  if (!tenantKey) {
    return true;
  }

  const hostKey = resolveTenantKeyFromHostnameOnly(window.location.hostname);
  if (!hostKey) {
    return true;
  }

  try {
    const result = await resolver.resolve(hostKey);

    if (!result.exists) {
      return router.createUrlTree(['/workshop-not-found'], {
        queryParams: { id: hostKey },
      });
    }

    if (!result.accessible) {
      return router.createUrlTree(['/workshop-suspended'], {
        queryParams: { id: hostKey, name: result.name ?? hostKey },
      });
    }

    setWorkshopTenantKey(hostKey);
    return true;
  } catch {
    return router.createUrlTree(['/workshop-not-found'], {
      queryParams: { id: hostKey },
    });
  }
};
