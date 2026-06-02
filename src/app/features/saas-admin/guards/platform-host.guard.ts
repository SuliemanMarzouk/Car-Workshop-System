import { CanActivateFn } from '@angular/router';
import { buildMainOriginUrl, resolveTenantKeyFromHostnameOnly } from '@core/workshop/tenant-context';

/** Platform admin is only available on the main host (no workshop subdomain). */
export const platformHostGuard: CanActivateFn = () => {
  const subdomain = resolveTenantKeyFromHostnameOnly(window.location.hostname);

  if (subdomain) {
    const path = window.location.pathname.replace(/^\/platform/, '/platform');
    window.location.replace(buildMainOriginUrl(path + window.location.search));
    return false;
  }

  return true;
};
