import { TenantSummary } from '../models/saas-admin.models';

/** Display label: subdomain.domain (e.g. workshop1.localhost) */
export function resolveTenantDomainLabel(tenant: TenantSummary): string | null {
  const domain = tenant.primary_domain ?? tenant.domains[0] ?? null;
  if (domain) {
    return domain;
  }

  return tenant.id ? `${tenant.id}.localhost` : null;
}

/** Full URL to open the workshop app (dashboard root on tenant subdomain). */
export function buildWorkshopAccessUrl(tenant: TenantSummary): string | null {
  const domain = resolveTenantDomainLabel(tenant);
  if (!domain) {
    return null;
  }

  if (typeof window !== 'undefined') {
    const { protocol, port } = window.location;
    const portSuffix = port ? `:${port}` : '';
    return `${protocol}//${domain}${portSuffix}/`;
  }

  return tenant.workshop_url ?? `http://${domain}:4200/`;
}
