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

  getStatusStyle(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
