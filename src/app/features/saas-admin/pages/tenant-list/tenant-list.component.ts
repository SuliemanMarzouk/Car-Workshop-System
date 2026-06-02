import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ExternalLink,
  Loader2,
  LucideAngularModule,
  PauseCircle,
  PlayCircle,
  Plus,
  Search,
  Users,
} from 'lucide-angular';
import { CreateTenantModalComponent } from '../../ui/create-tenant-modal/create-tenant-modal.component';
import { SaaSAdminStateService } from '../../services/saas-admin-state.service';
import { TenantSummary } from '../../models/saas-admin.models';
import { buildWorkshopAccessUrl, resolveTenantDomainLabel } from '../../utils/workshop-link.util';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslateModule,
    LucideAngularModule,
    CreateTenantModalComponent,
  ],
  templateUrl: './tenant-list.component.html',
  styleUrl: '../../styles/platform-content.scss',
})
export class TenantListComponent implements OnInit {
  readonly state = inject(SaaSAdminStateService);

  readonly Plus = Plus;
  readonly Search = Search;
  readonly Loader2 = Loader2;
  readonly Users = Users;
  readonly ExternalLink = ExternalLink;
  readonly PauseCircle = PauseCircle;
  readonly PlayCircle = PlayCircle;

  readonly createModalOpen = signal(false);
  searchInput = '';

  ngOnInit(): void {
    void this.state.loadTenants();
  }

  tenantDomain(tenant: TenantSummary): string | null {
    return resolveTenantDomainLabel(tenant);
  }

  tenantUrl(tenant: TenantSummary): string | null {
    return buildWorkshopAccessUrl(tenant);
  }

  onSearch(): void {
    this.state.searchQuery.set(this.searchInput.trim());
    void this.state.loadTenants(1);
  }

  openCreateModal(): void {
    this.createModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.createModalOpen.set(false);
  }

  changePage(page: number): void {
    void this.state.loadTenants(page);
  }

  toggleStatus(tenant: TenantSummary): void {
    void this.state.toggleTenantStatus(tenant);
  }
}
