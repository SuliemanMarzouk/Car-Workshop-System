import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SaaSAdminRepository } from '../data/saas-admin.repository';
import {
  CentralDashboardStats,
  CreateTenantPayload,
  TenantStatus,
  TenantSummary,
} from '../models/saas-admin.models';

@Injectable({ providedIn: 'root' })
export class SaaSAdminStateService {
  private readonly repository = inject(SaaSAdminRepository);

  readonly statsLoading = signal(false);
  readonly stats = signal<CentralDashboardStats | null>(null);

  readonly tenantsLoading = signal(false);
  readonly tenants = signal<TenantSummary[]>([]);
  readonly tenantsMeta = signal({ current_page: 1, last_page: 1, per_page: 15, total: 0 });
  readonly searchQuery = signal('');

  readonly actionLoading = signal(false);
  readonly error = signal('');

  async loadStats(): Promise<void> {
    this.statsLoading.set(true);
    this.error.set('');

    try {
      const stats = await firstValueFrom(this.repository.getDashboardStats());
      this.stats.set(stats);
    } catch {
      this.error.set('Failed to load platform stats');
    } finally {
      this.statsLoading.set(false);
    }
  }

  async loadTenants(page = 1): Promise<void> {
    this.tenantsLoading.set(true);
    this.error.set('');

    try {
      const response = await firstValueFrom(
        this.repository.listTenants(page, this.searchQuery()),
      );
      this.tenants.set(response.data);
      this.tenantsMeta.set(response.meta);
    } catch {
      this.error.set('Failed to load workshops');
    } finally {
      this.tenantsLoading.set(false);
    }
  }

  async createTenant(payload: CreateTenantPayload): Promise<boolean> {
    this.actionLoading.set(true);
    this.error.set('');

    try {
      await firstValueFrom(this.repository.createTenant(payload));
      await Promise.all([this.loadTenants(1), this.loadStats()]);
      return true;
    } catch {
      this.error.set('Failed to create workshop');
      return false;
    } finally {
      this.actionLoading.set(false);
    }
  }

  async toggleTenantStatus(tenant: TenantSummary): Promise<void> {
    const nextStatus: TenantStatus = tenant.status === 'active' ? 'suspended' : 'active';
    this.actionLoading.set(true);
    this.error.set('');

    try {
      const updated = await firstValueFrom(
        this.repository.updateTenantStatus(tenant.id, nextStatus),
      );
      this.tenants.update((list) =>
        list.map((item) => (item.id === updated.id ? updated : item)),
      );
      await this.loadStats();
    } catch {
      this.error.set('Failed to update workshop status');
    } finally {
      this.actionLoading.set(false);
    }
  }
}
