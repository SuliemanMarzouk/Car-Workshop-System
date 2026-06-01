import { Component, computed, EventEmitter, inject, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideAngularModule,
  LayoutDashboard,
  Car,
  ClipboardList,
  Clock,
  Receipt,
  Users,
  Settings,
  Shield,
  type LucideIconData,
} from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { PERMISSIONS, Permission } from '@core/auth/models/permission';
import { PermissionService } from '@core/auth/services/permission.service';

interface SidebarItem {
  icon: LucideIconData;
  label: string;
  path: string;
  permission: Permission;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Output() onClose = new EventEmitter<void>();

  private readonly permissions = inject(PermissionService);

  private readonly allMenuItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: 'sidebar.dashboard', path: '/', permission: PERMISSIONS.dashboardView },
    { icon: Car, label: 'sidebar.cars', path: '/cars', permission: PERMISSIONS.carsView },
    {
      icon: ClipboardList,
      label: 'sidebar.work_orders',
      path: '/work-orders',
      permission: PERMISSIONS.workOrdersView,
    },
    {
      icon: Clock,
      label: 'sidebar.pending_approvals',
      path: '/pending-approvals',
      permission: PERMISSIONS.workOrdersApprove,
    },
    { icon: Receipt, label: 'sidebar.invoices', path: '/invoices', permission: PERMISSIONS.invoicesView },
    { icon: Users, label: 'sidebar.users', path: '/users', permission: PERMISSIONS.usersView },
    { icon: Shield, label: 'sidebar.roles', path: '/roles', permission: PERMISSIONS.rolesView },
    { icon: Settings, label: 'sidebar.settings', path: '/settings', permission: PERMISSIONS.settingsView },
  ];

  readonly menuItems = computed(() =>
    this.allMenuItems.filter((item) => this.permissions.has(item.permission)),
  );

  close(): void {
    this.onClose.emit();
  }
}
