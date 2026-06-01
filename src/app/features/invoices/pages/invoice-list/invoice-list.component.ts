import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Download, Eye, Plus, Search } from 'lucide-angular';
import { InvoiceRepository } from '@features/invoices/data/invoice.repository';
import { CreateInvoicePayload, Invoice } from '@features/invoices/models/invoice.model';
import { WorkOrderRepository } from '@features/work-orders/data/work-order.repository';
import { WorkOrder } from '@features/work-orders/models/work-order.model';
import { ModalComponent } from '@shared/ui/modal/modal.component';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule, ModalComponent],
  templateUrl: './invoice-list.component.html',
})
export class InvoiceListComponent implements OnInit {
  private readonly invoiceRepository = inject(InvoiceRepository);
  private readonly workOrderRepository = inject(WorkOrderRepository);

  readonly Search = Search;
  readonly Download = Download;
  readonly Eye = Eye;
  readonly Plus = Plus;

  readonly invoices = signal<Invoice[]>([]);
  readonly workOrders = signal<WorkOrder[]>([]);
  readonly loading = signal(true);
  readonly searchTerm = signal('');
  readonly isAddModalOpen = signal(false);
  readonly selectedInvoice = signal<Invoice | null>(null);
  readonly errors = signal<Record<string, string[]>>({});
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);

  formData: CreateInvoicePayload = {
    work_order_id: '',
    subtotal: '0.00',
    tax: '0.00',
    total: '0.00',
  };

  ngOnInit(): void {
    this.fetchInvoices();
  }

  fetchInvoices(): void {
    this.loading.set(true);
    this.invoiceRepository.list(this.currentPage()).subscribe({
      next: (response) => {
        this.invoices.set(response.data);
        this.totalPages.set(response.meta.last_page);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  fetchWorkOrders(): void {
    this.workOrderRepository.list(1).subscribe({
      next: (response) => {
        this.workOrders.set(
          response.data.filter((order) => order.status === 'approved' || order.status === 'pending'),
        );
      },
    });
  }

  handleWorkOrderSelect(event: Event): void {
    const workOrderId = (event.target as HTMLSelectElement).value;
    const selected = this.workOrders().find((order) => order.id === Number(workOrderId));

    let subtotal = 0;
    if (selected?.items) {
      subtotal = selected.items.reduce(
        (sum, item) => sum + (parseFloat(String(item.price)) || 0),
        0,
      );
    }

    const tax = subtotal * 0.15;

    this.formData = {
      work_order_id: workOrderId,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: (subtotal + tax).toFixed(2),
    };
  }

  handleSubmit(): void {
    this.errors.set({});
    this.invoiceRepository.create(this.formData).subscribe({
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
      error: (error: { error?: { errors?: Record<string, string[]> } }) => {
        if (error.error?.errors) {
          this.errors.set(error.error.errors);
        }
      },
    });
  }

  handleViewDetails(invoice: Invoice): void {
    this.selectedInvoice.set(invoice);
  }

  onAddModalOpen(): void {
    this.isAddModalOpen.set(true);
    this.fetchWorkOrders();
  }

  get filteredInvoices(): Invoice[] {
    const term = this.searchTerm().toLowerCase();
    return this.invoices().filter(
      (invoice) =>
        invoice.id.toString().includes(term) ||
        invoice.work_order?.car?.plate_number.toLowerCase().includes(term) ||
        invoice.work_order?.car?.owner_name.toLowerCase().includes(term),
    );
  }
}
