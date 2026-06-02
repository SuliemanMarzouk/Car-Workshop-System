import { HttpInterceptorFn } from '@angular/common/http';

function resolveTenantKeyFromHostname(hostname: string): string | null {
  // Examples:
  // - workshop1.localhost => workshop1
  // - workshop1.example.com => workshop1
  // - localhost / 127.0.0.1 => null
  const host = hostname.trim().toLowerCase();
  if (!host || host === 'localhost' || host === '127.0.0.1') {
    return null;
  }

  const parts = host.split('.').filter(Boolean);
  if (parts.length < 2) {
    return null;
  }

  const subdomain = parts[0];
  if (!subdomain || subdomain === 'www') {
    return null;
  }

  return subdomain;
}

export const tenantInterceptor: HttpInterceptorFn = (request, next) => {
  const tenantKey = resolveTenantKeyFromHostname(window.location.hostname);
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

