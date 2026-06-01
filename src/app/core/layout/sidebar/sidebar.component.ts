import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Car, ClipboardList, Clock, Receipt, Users, Settings } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Output() onClose = new EventEmitter<void>();

  menuItems = [
    { icon: LayoutDashboard, label: 'sidebar.dashboard', path: '/' },
    { icon: Car, label: 'sidebar.cars', path: '/cars' },
    { icon: ClipboardList, label: 'sidebar.work_orders', path: '/work-orders' },
    { icon: Clock, label: 'sidebar.pending_approvals', path: '/pending-approvals' },
    { icon: Receipt, label: 'sidebar.invoices', path: '/invoices' },
    { icon: Users, label: 'sidebar.users', path: '/users' },
    { icon: Settings, label: 'sidebar.settings', path: '/settings' },
  ];

  close() {
    this.onClose.emit();
  }
}
