import { environment } from '@env/environment';

const TENANT_STORAGE_KEY = 'workshop_tenant';

/** Workshop routes only — platform admin must not send X-Tenant. */
export function isPlatformBrowserContext(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.location.pathname.startsWith('/platform');
}

/** Subdomain only — ignores env default and localStorage. */
export function resolveTenantKeyFromHostnameOnly(hostname: string): string | null {
  return resolveTenantKeyFromHostname(hostname);
}

function resolveTenantKeyFromHostname(hostname: string): string | null {
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

/**
 * Resolves tenant key for workshop API calls: subdomain → localStorage → env default.
 */
export function resolveWorkshopTenantKey(): string | null {
  if (isPlatformBrowserContext()) {
    return null;
  }

  const fromHost =
    typeof window !== 'undefined'
      ? resolveTenantKeyFromHostname(window.location.hostname)
      : null;
  if (fromHost) {
    return fromHost;
  }

  if (typeof window !== 'undefined') {
    const fromStorage = localStorage.getItem(TENANT_STORAGE_KEY)?.trim();
    if (fromStorage) {
      return fromStorage;
    }
  }

  const fromEnv = environment.defaultTenantKey?.trim();
  return fromEnv || null;
}

export function setWorkshopTenantKey(tenantKey: string): void {
  localStorage.setItem(TENANT_STORAGE_KEY, tenantKey.trim());
}

export function clearWorkshopTenantKey(): void {
  localStorage.removeItem(TENANT_STORAGE_KEY);
}

/** Strip workshop subdomain so platform runs on localhost / apex domain. */
export function buildMainOriginUrl(path = '/'): string {
  const { protocol, port, hostname } = window.location;
  const host = hostname.trim().toLowerCase();
  const parts = host.split('.').filter(Boolean);

  let mainHost = host;
  if (parts.length >= 2 && parts[0] !== 'localhost' && parts[0] !== 'www' && parts[0] !== '127') {
    mainHost = parts.slice(1).join('.');
  }

  const portSuffix = port ? `:${port}` : '';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${protocol}//${mainHost}${portSuffix}${normalizedPath}`;
}
