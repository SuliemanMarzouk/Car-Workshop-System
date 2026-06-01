import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Eye } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-recent-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, TranslateModule],
  templateUrl: './recent-orders.component.html',
  styleUrl: './recent-orders.component.css'
})
export class RecentOrdersComponent {
  readonly Eye = Eye;

  orders = [
    {
      id: 'WO-001',
      plate: 'ABC-123',
      owner: 'Ahmed Al-Salem',
      status: 'pending',
      date: '2025-01-24',
    },
    {
      id: 'WO-002',
      plate: 'XYZ-789',
      owner: 'Mohammed Al-Rashid',
      status: 'approved',
      date: '2025-01-23',
    },
    {
      id: 'WO-003',
      plate: 'DEF-456',
      owner: 'Fatima Al-Zahrani',
      status: 'completed',
      date: '2025-01-22',
    }
  ];

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'badge-pending';
      case 'approved':
        return 'badge-approved';
      case 'rejected':
        return 'badge-rejected';
      case 'completed':
      case 'in_progress':
        return 'badge-completed';
      default:
        return 'badge-pending';
    }
  }
}
