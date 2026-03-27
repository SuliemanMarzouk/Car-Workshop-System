import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, CheckCircle, XCircle, Eye, Search } from 'lucide-angular';
import { WorkOrderService } from '../../services/work-order.service';

@Component({
  selector: 'app-pending-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
  templateUrl: './pending-approvals.component.html',
  styleUrl: './pending-approvals.component.css'
})
export class PendingApprovalsComponent implements OnInit {
  private workOrderService = inject(WorkOrderService);

  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly Eye = Eye;
  readonly Search = Search;

  workOrders = signal<any[]>([]);
  loading = signal(true);
  searchTerm = signal('');

  ngOnInit() {
    this.fetchPendingOrders();
  }

  fetchPendingOrders() {
    this.loading.set(true);
    this.workOrderService.getAll(1).subscribe({
      next: (response) => {
        this.workOrders.set(response.data.filter((wo: any) => wo.status === 'pending'));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to fetch pending orders', error);
        this.loading.set(false);
      }
    });
  }

  get filteredOrders() {
    const term = this.searchTerm().toLowerCase();
    return this.workOrders().filter(order => 
      order.id.toString().includes(term) ||
      order.car?.plate_number.toLowerCase().includes(term) ||
      order.car?.owner_name.toLowerCase().includes(term)
    );
  }

  approveOrder(id: number) {
    this.workOrderService.update(id, { status: 'approved' }).subscribe(() => {
      this.fetchPendingOrders();
    });
  }

  rejectOrder(id: number) {
    this.workOrderService.update(id, { status: 'rejected' }).subscribe(() => {
      this.fetchPendingOrders();
    });
  }
}
