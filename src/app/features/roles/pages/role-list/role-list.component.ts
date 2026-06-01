import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, Pencil, Plus, Shield, Trash2, Users } from 'lucide-angular';
import { HasPermissionDirective } from '@core/auth/directives/has-permission.directive';
import { PERMISSIONS } from '@core/auth/models/permission';
import { LanguageService } from '@core/i18n/language.service';
import { RoleRepository } from '@features/roles/data/role.repository';
import {
  ManagedRole,
  PermissionDefinition,
  RoleFormPayload,
} from '@features/roles/models/role.model';
import { ModalComponent } from '@shared/ui/modal/modal.component';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    LucideAngularModule,
    ModalComponent,
    HasPermissionDirective,
  ],
  templateUrl: './role-list.component.html',
})
export class RoleListComponent implements OnInit {
  private readonly roleRepository = inject(RoleRepository);
  private readonly translate = inject(TranslateService);
  readonly language = inject(LanguageService);

  readonly PERMISSIONS = PERMISSIONS;
  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Shield = Shield;
  readonly Users = Users;

  readonly roles = signal<ManagedRole[]>([]);
  readonly allPermissions = signal<PermissionDefinition[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly isFormModalOpen = signal(false);
  readonly editingRole = signal<ManagedRole | null>(null);
  readonly errors = signal<Record<string, string[]>>({});
  readonly searchTerm = signal('');

  formData: RoleFormPayload = {
    name: '',
    name_ar: '',
    slug: '',
    permissions: [],
  };

  readonly filteredRoles = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.roles();
    }

    return this.roles().filter(
      (role) =>
        role.name.toLowerCase().includes(term) ||
        role.name_ar.includes(term) ||
        role.slug.toLowerCase().includes(term),
    );
  });

  readonly permissionGroups = computed(() => {
    const groups = new Map<string, PermissionDefinition[]>();

    for (const permission of this.allPermissions()) {
      const list = groups.get(permission.group) ?? [];
      list.push(permission);
      groups.set(permission.group, list);
    }

    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  });

  readonly isOrgAdminRole = computed(
    () => this.editingRole()?.slug === 'organization_admin',
  );

  ngOnInit(): void {
    this.loadData();
  }

  roleDisplayName(role: ManagedRole): string {
    return this.language.isArabic() ? role.name_ar : role.name;
  }

  permissionLabel(permission: PermissionDefinition): string {
    return this.language.isArabic() ? permission.name_ar : permission.name;
  }

  groupLabel(group: string): string {
    return this.translate.instant(`roles.groups.${group}`);
  }

  openCreateModal(): void {
    this.editingRole.set(null);
    this.errors.set({});
    this.formData = {
      name: '',
      name_ar: '',
      slug: '',
      permissions: [],
    };
    this.isFormModalOpen.set(true);
  }

  openEditModal(role: ManagedRole): void {
    this.editingRole.set(role);
    this.errors.set({});
    this.formData = {
      name: role.name,
      name_ar: role.name_ar,
      slug: role.slug,
      permissions: [...role.permissions],
    };
    this.isFormModalOpen.set(true);
  }

  closeModal(): void {
    this.isFormModalOpen.set(false);
    this.editingRole.set(null);
  }

  isPermissionChecked(slug: string): boolean {
    return this.formData.permissions.includes(slug);
  }

  togglePermission(slug: string, checked: boolean): void {
    if (this.isOrgAdminRole()) {
      return;
    }

    if (checked) {
      if (!this.formData.permissions.includes(slug)) {
        this.formData.permissions = [...this.formData.permissions, slug];
      }
      return;
    }

    this.formData.permissions = this.formData.permissions.filter((p) => p !== slug);
  }

  toggleGroup(group: string, checked: boolean): void {
    if (this.isOrgAdminRole()) {
      return;
    }

    const slugs =
      this.permissionGroups().find(([key]) => key === group)?.[1].map((p) => p.slug) ?? [];

    if (checked) {
      const merged = new Set([...this.formData.permissions, ...slugs]);
      this.formData.permissions = Array.from(merged);
      return;
    }

    this.formData.permissions = this.formData.permissions.filter((p) => !slugs.includes(p));
  }

  isGroupFullySelected(group: string): boolean {
    const slugs =
      this.permissionGroups().find(([key]) => key === group)?.[1].map((p) => p.slug) ?? [];
    return slugs.length > 0 && slugs.every((slug) => this.formData.permissions.includes(slug));
  }

  saveRole(): void {
    this.saving.set(true);
    this.errors.set({});

    const editing = this.editingRole();
    const payload: RoleFormPayload = {
      name: this.formData.name,
      name_ar: this.formData.name_ar,
      permissions: this.formData.permissions,
    };

    if (this.formData.slug?.trim()) {
      payload.slug = this.formData.slug.trim();
    }

    const request$ = editing
      ? this.roleRepository.update(editing.id, payload)
      : this.roleRepository.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeModal();
        this.loadData();
      },
      error: (err) => this.handleError(err),
    });
  }

  deleteRole(role: ManagedRole): void {
    if (role.is_system) {
      return;
    }

    if (!confirm(this.translate.instant('roles.confirm_delete'))) {
      return;
    }

    this.roleRepository.delete(role.id).subscribe({
      next: () => this.loadData(),
      error: (err) => this.handleError(err),
    });
  }

  private loadData(): void {
    this.loading.set(true);

    this.roleRepository.list().subscribe({
      next: (roles) => {
        this.roles.set(roles);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.roleRepository.listPermissions().subscribe({
      next: (permissions) => this.allPermissions.set(permissions),
    });
  }

  private handleError(error: unknown): void {
    this.saving.set(false);
    const body = (error as { error?: { errors?: Record<string, string[]> } })?.error;
    if (body?.errors) {
      this.errors.set(body.errors);
    }
  }
}
