import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Eye } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { WorkOrderRepository } from '@features/work-orders/data/work-order.repository';
import { WorkOrder } from '@features/work-orders/models/work-order.model';

interface RecentOrderRow {
  id: number;
  plate: string;
  owner: string;
  status: string;
  date: string;
}

@Component({
  selector: 'app-recent-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, TranslateModule],
  templateUrl: './recent-orders.component.html',
})
export class RecentOrdersComponent implements OnInit {
  private readonly workOrderRepository = inject(WorkOrderRepository);

  readonly Eye = Eye;
  readonly orders = signal<RecentOrderRow[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.workOrderRepository.list(1).subscribe({
      next: (response) => {
        const rows = response.data.slice(0, 5).map((order) => this.toRow(order));
        this.orders.set(rows);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

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

  private toRow(order: WorkOrder): RecentOrderRow {
    return {
      id: order.id,
      plate: order.car?.plate_number ?? '—',
      owner: order.car?.owner_name ?? '—',
      status: order.status,
      date: order.created_at ? new Date(order.created_at).toLocaleDateString() : '—',
    };
  }
}
