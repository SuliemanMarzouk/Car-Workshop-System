import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowserContext, resolveWorkshopTenantKey } from '../tenant-context';

function isCentralApiRequest(url: string): boolean {
  return url.includes('/central/');
}

export const tenantInterceptor: HttpInterceptorFn = (request, next) => {
  if (isCentralApiRequest(request.url) || isPlatformBrowserContext()) {
    return next(request);
  }

  const tenantKey = resolveWorkshopTenantKey();
  if (!tenantKey) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        'X-Tenant': tenantKey,
      },
    }),
  );
};
