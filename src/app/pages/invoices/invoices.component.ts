import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Search, Download, Eye, Plus } from 'lucide-angular';
import { InvoiceService } from '../../services/invoice.service';
import { WorkOrderService } from '../../services/work-order.service';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule, ModalComponent],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  private workOrderService = inject(WorkOrderService);

  readonly Search = Search;
  readonly Download = Download;
  readonly Eye = Eye;
  readonly Plus = Plus;

  invoices = signal<any[]>([]);
  workOrders = signal<any[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  isAddModalOpen = signal(false);
  selectedInvoice = signal<any>(null);
  formData = {
    work_order_id: '',
    subtotal: '0.00',
    tax: '0.00',
    total: '0.00',
  };
  errors = signal<any>({});
  currentPage = signal(1);
  totalPages = signal(1);

  ngOnInit() {
    this.fetchInvoices();
  }

  fetchInvoices() {
    this.loading.set(true);
    this.invoiceService.getAll(this.currentPage()).subscribe({
      next: (response) => {
        this.invoices.set(response.data);
        this.totalPages.set(response.meta.last_page);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to fetch invoices', error);
        this.loading.set(false);
      }
    });
  }

  fetchWorkOrders() {
    this.workOrderService.getAll(1).subscribe({
      next: (response) => {
        this.workOrders.set(response.data.filter((wo: any) => wo.status === 'approved' || wo.status === 'pending'));
      },
      error: (error) => {
        console.error('Failed to fetch work orders', error);
      }
    });
  }

  handleWorkOrderSelect(event: any) {
    const workOrderId = event.target.value;
    const selectedWO = this.workOrders().find(wo => wo.id == workOrderId);
    
    let subtotal = 0;
    if (selectedWO && selectedWO.items) {
        subtotal = selectedWO.items.reduce((sum: number, item: any) => sum + (parseFloat(item.price) || 0), 0);
    }
    
    const tax = subtotal * 0.15;
    
    this.formData = {
        work_order_id: workOrderId,
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: (subtotal + tax).toFixed(2)
    };
  }

  handleSubmit() {
    this.errors.set({});
    this.invoiceService.create(this.formData).subscribe({
      next: () => {
        this.isAddModalOpen.set(false);
        this.formData = {
          work_order_id: '',
          subtotal: '0.00',
          tax: '0.00',
          total: '0.00',
        };
        this.fetchInvoices();
      },
      error: (error) => {
        if (error.error?.errors) {
          this.errors.set(error.error.errors);
        }
      }
    });
  }

  handleViewDetails(invoice: any) {
    this.selectedInvoice.set(invoice);
  }

  onAddModalOpen() {
    this.isAddModalOpen.set(true);
    this.fetchWorkOrders();
  }

  get filteredInvoices() {
    const term = this.searchTerm().toLowerCase();
    return this.invoices().filter(inv => 
      inv.id.toString().includes(term) ||
      inv.work_order?.car?.plate_number.toLowerCase().includes(term) ||
      inv.work_order?.car?.owner_name.toLowerCase().includes(term)
    );
  }
}
