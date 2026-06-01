import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, CheckCircle, Eye, Search, XCircle } from 'lucide-angular';
import { WorkOrderRepository } from '@features/work-orders/data/work-order.repository';
import { WorkOrder, WorkOrderStatus } from '@features/work-orders/models/work-order.model';

@Component({
  selector: 'app-pending-approval-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
  templateUrl: './pending-approval-list.component.html',
})
export class PendingApprovalListComponent implements OnInit {
  private readonly workOrderRepository = inject(WorkOrderRepository);

  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly Eye = Eye;
  readonly Search = Search;

  readonly workOrders = signal<WorkOrder[]>([]);
  readonly loading = signal(true);
  readonly searchTerm = signal('');

  ngOnInit(): void {
    this.fetchPendingOrders();
  }

  fetchPendingOrders(): void {
    this.loading.set(true);
    this.workOrderRepository.list(1).subscribe({
      next: (response) => {
        this.workOrders.set(response.data.filter((order) => order.status === 'pending'));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  approveOrder(id: number): void {
    this.updateStatus(id, 'approved');
  }

  rejectOrder(id: number): void {
    this.updateStatus(id, 'rejected');
  }

  private updateStatus(id: number, status: WorkOrderStatus): void {
    this.workOrderRepository.update(id, { status }).subscribe({
      next: () => this.fetchPendingOrders(),
    });
  }

  getOrderTotal(order: WorkOrder): string {
    if (!order.items?.length) {
      return '0';
    }

    const total = order.items.reduce(
      (sum, item) => sum + (parseFloat(String(item.price)) || 0),
      0,
    );

    return total.toFixed(2);
  }

  get filteredOrders(): WorkOrder[] {
    const term = this.searchTerm().toLowerCase();
    return this.workOrders().filter(
      (order) =>
        order.id.toString().includes(term) ||
        order.car?.plate_number.toLowerCase().includes(term) ||
        order.car?.owner_name.toLowerCase().includes(term),
    );
  }
}
