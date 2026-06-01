import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, Mail, Pencil, Plus, Shield, Trash2, User } from 'lucide-angular';
import { AuthService } from '@core/auth/services/auth.service';
import { HasPermissionDirective } from '@core/auth/directives/has-permission.directive';
import { PERMISSIONS } from '@core/auth/models/permission';
import { LanguageService } from '@core/i18n/language.service';
import { UserRepository } from '@features/users/data/user.repository';
import {
  CreateTeamUserPayload,
  RoleOption,
  TeamUser,
  UpdateTeamUserPayload,
} from '@features/users/models/user.model';
import { ModalComponent } from '@shared/ui/modal/modal.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    LucideAngularModule,
    ModalComponent,
    HasPermissionDirective,
  ],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  private readonly userRepository = inject(UserRepository);
  private readonly authService = inject(AuthService);
  private readonly translate = inject(TranslateService);
  readonly language = inject(LanguageService);

  readonly PERMISSIONS = PERMISSIONS;
  readonly User = User;
  readonly Shield = Shield;
  readonly Mail = Mail;
  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;

  readonly users = signal<TeamUser[]>([]);
  readonly roles = signal<RoleOption[]>([]);
  readonly rolesLoading = signal(false);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly isFormModalOpen = signal(false);
  readonly editingUser = signal<TeamUser | null>(null);
  readonly errors = signal<Record<string, string[]>>({});
  readonly searchTerm = signal('');

  formData: CreateTeamUserPayload = {
    name: '',
    email: '',
    password: '',
    role_id: 0,
  };

  readonly filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.users();

    if (!term) {
      return list;
    }

    return list.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.role?.slug ?? '').toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchRoles();
  }

  roleLabel(user: TeamUser): string {
    const slug = user.role?.slug;
    if (!slug) {
      return '';
    }

    return `roles.${slug}`;
  }

  roleOptionLabel(role: RoleOption): string {
    return `roles.${role.slug}`;
  }

  openCreateModal(): void {
    this.ensureRolesLoaded();
    this.editingUser.set(null);
    this.errors.set({});
    const defaultRoleId = this.roles()[0]?.id ?? 0;
    this.formData = {
      name: '',
      email: '',
      password: '',
      role_id: defaultRoleId,
    };
    this.isFormModalOpen.set(true);
  }

  openEditModal(user: TeamUser): void {
    this.ensureRolesLoaded();
    this.editingUser.set(user);
    this.errors.set({});
    this.formData = {
      name: user.name,
      email: user.email,
      password: '',
      role_id: user.role?.id ?? 0,
    };
    this.isFormModalOpen.set(true);
  }

  closeModal(): void {
    this.isFormModalOpen.set(false);
    this.editingUser.set(null);
  }

  saveUser(): void {
    this.saving.set(true);
    this.errors.set({});

    const editing = this.editingUser();

    if (editing) {
      const payload: UpdateTeamUserPayload = {
        name: this.formData.name,
        email: this.formData.email,
        role_id: this.formData.role_id,
      };

      if (this.formData.password.trim()) {
        payload.password = this.formData.password;
      }

      this.userRepository.update(editing.id, payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeModal();
          this.fetchUsers();
        },
        error: (err) => this.handleError(err),
      });

      return;
    }

    this.userRepository.create(this.formData).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeModal();
        this.fetchUsers();
      },
      error: (err) => this.handleError(err),
    });
  }

  deleteUser(user: TeamUser): void {
    if (user.id === this.authService.user()?.id) {
      return;
    }

    if (!confirm(this.translate.instant('users.confirm_delete'))) {
      return;
    }

    this.userRepository.delete(user.id).subscribe({
      next: () => this.fetchUsers(),
      error: (err) => this.handleError(err),
    });
  }

  isCurrentUser(user: TeamUser): boolean {
    return user.id === this.authService.user()?.id;
  }

  private fetchUsers(): void {
    this.loading.set(true);
    this.userRepository.list().subscribe({
      next: (response) => {
        this.users.set(response.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private ensureRolesLoaded(): void {
    if (this.roles().length > 0 || this.rolesLoading()) {
      return;
    }

    this.fetchRoles();
  }

  private fetchRoles(): void {
    this.rolesLoading.set(true);
    this.userRepository.listRoles().subscribe({
      next: (roles) => {
        this.roles.set(roles);
        this.rolesLoading.set(false);
        if (!this.editingUser() && roles.length > 0 && !this.formData.role_id) {
          this.formData.role_id = roles[0].id;
        }
      },
      error: () => this.rolesLoading.set(false),
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
