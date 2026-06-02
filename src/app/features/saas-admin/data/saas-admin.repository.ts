import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '@core/http/api-client.service';
import {
  CentralAuthLoginResponse,
  CentralAdminUser,
  CentralDashboardStats,
  CreateTenantPayload,
  CreateTenantUserPayload,
  ResetTenantUserPasswordPayload,
  TenantRoleOption,
  TenantStatus,
  TenantSummary,
  TenantUsersListResponse,
  TenantWorkshopUser,
  TenantsListResponse,
} from '../models/saas-admin.models';

@Injectable({ providedIn: 'root' })
export class SaaSAdminRepository {
  private readonly api = inject(ApiClient);

  login(email: string, password: string): Observable<CentralAuthLoginResponse> {
    return this.api.post<CentralAuthLoginResponse>('/central/auth/login', { email, password });
  }

  logout(): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('/central/auth/logout', {});
  }

  getCurrentUser(): Observable<CentralAdminUser> {
    return this.api.get<CentralAdminUser>('/central/auth/user');
  }

  getDashboardStats(): Observable<CentralDashboardStats> {
    return this.api.get<CentralDashboardStats>('/central/dashboard/stats');
  }

  listTenants(page = 1, search = ''): Observable<TenantsListResponse> {
    const params: Record<string, string | number> = { page };
    if (search.trim()) {
      params['search'] = search.trim();
    }

    return this.api.get<TenantsListResponse>('/central/tenants', params);
  }

  createTenant(payload: CreateTenantPayload): Observable<TenantSummary> {
    return this.api.post<TenantSummary>('/central/tenants', payload);
  }

  updateTenantStatus(tenantId: string, status: TenantStatus): Observable<TenantSummary> {
    return this.api.patch<TenantSummary>(`/central/tenants/${tenantId}/status`, { status });
  }

  getTenant(tenantId: string): Observable<TenantSummary> {
    return this.api.get<TenantSummary>(`/central/tenants/${tenantId}`);
  }

  listTenantUsers(tenantId: string, page = 1): Observable<TenantUsersListResponse> {
    return this.api.get<TenantUsersListResponse>(`/central/tenants/${tenantId}/users`, { page });
  }

  listTenantRoles(tenantId: string): Observable<TenantRoleOption[]> {
    return this.api.get<TenantRoleOption[]>(`/central/tenants/${tenantId}/roles`);
  }

  createTenantUser(tenantId: string, payload: CreateTenantUserPayload): Observable<TenantWorkshopUser> {
    return this.api.post<TenantWorkshopUser>(`/central/tenants/${tenantId}/users`, payload);
  }

  resetTenantUserPassword(
    tenantId: string,
    userId: number,
    payload: ResetTenantUserPasswordPayload,
  ): Observable<TenantWorkshopUser> {
    return this.api.patch<TenantWorkshopUser>(
      `/central/tenants/${tenantId}/users/${userId}/password`,
      payload,
    );
  }
}
