import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ArrowLeft,
  ExternalLink,
  Key,
  Loader2,
  LucideAngularModule,
  Plus,
  User,
} from 'lucide-angular';
import { firstValueFrom } from 'rxjs';
import { LanguageService } from '@core/i18n/language.service';
import { SaaSAdminRepository } from '../../data/saas-admin.repository';
import {
  CreateTenantUserPayload,
  TenantRoleOption,
  TenantSummary,
  TenantWorkshopUser,
} from '../../models/saas-admin.models';
import { ModalComponent } from '@shared/ui/modal/modal.component';

@Component({
  selector: 'app-tenant-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslateModule,
    LucideAngularModule,
    ModalComponent,
  ],
  templateUrl: './tenant-users.component.html',
  styleUrl: '../../styles/platform-content.scss',
})
export class TenantUsersComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly repository = inject(SaaSAdminRepository);
  readonly language = inject(LanguageService);

  readonly ArrowLeft = ArrowLeft;
  readonly ExternalLink = ExternalLink;
  readonly Key = Key;
  readonly Loader2 = Loader2;
  readonly Plus = Plus;
  readonly User = User;

  readonly tenantId = this.route.snapshot.paramMap.get('tenantId') ?? '';
  readonly tenant = signal<TenantSummary | null>(null);
  readonly users = signal<TenantWorkshopUser[]>([]);
  readonly roles = signal<TenantRoleOption[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly createModalOpen = signal(false);
  readonly resetModalOpen = signal(false);
  readonly selectedUser = signal<TenantWorkshopUser | null>(null);
  readonly error = signal('');

  createForm: CreateTenantUserPayload = {
    name: '',
    email: '',
    password: '',
    role_id: 0,
  };

  resetForm = {
    password: '',
    password_confirmation: '',
  };

  ngOnInit(): void {
    void this.loadPage();
  }

  roleLabel(user: TenantWorkshopUser): string {
    if (!user.role) {
      return '—';
    }

    return this.language.isArabic() ? user.role.name_ar : user.role.name;
  }

  openCreateModal(): void {
    this.createForm = {
      name: '',
      email: '',
      password: '',
      role_id: this.roles()[0]?.id ?? 0,
    };
    this.createModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.createModalOpen.set(false);
  }

  openResetModal(user: TenantWorkshopUser): void {
    this.selectedUser.set(user);
    this.resetForm = { password: '', password_confirmation: '' };
    this.resetModalOpen.set(true);
  }

  closeResetModal(): void {
    this.resetModalOpen.set(false);
    this.selectedUser.set(null);
  }

  async submitCreate(): Promise<void> {
    this.saving.set(true);
    this.error.set('');

    try {
      await firstValueFrom(this.repository.createTenantUser(this.tenantId, this.createForm));
      this.closeCreateModal();
      await this.loadUsers();
    } catch {
      this.error.set('Failed to create user');
    } finally {
      this.saving.set(false);
    }
  }

  async submitReset(): Promise<void> {
    const user = this.selectedUser();
    if (!user) {
      return;
    }

    this.saving.set(true);
    this.error.set('');

    try {
      await firstValueFrom(
        this.repository.resetTenantUserPassword(this.tenantId, user.id, this.resetForm),
      );
      this.closeResetModal();
    } catch {
      this.error.set('Failed to reset password');
    } finally {
      this.saving.set(false);
    }
  }

  private async loadPage(): Promise<void> {
    this.loading.set(true);
    this.error.set('');

    try {
      const [tenant, roles] = await Promise.all([
        firstValueFrom(this.repository.getTenant(this.tenantId)),
        firstValueFrom(this.repository.listTenantRoles(this.tenantId)),
      ]);

      this.tenant.set(tenant);
      this.roles.set(roles);
      await this.loadUsers();
    } catch {
      this.error.set('Failed to load workshop');
    } finally {
      this.loading.set(false);
    }
  }

  private async loadUsers(): Promise<void> {
    const response = await firstValueFrom(this.repository.listTenantUsers(this.tenantId));
    this.users.set(response.data);
  }
}
