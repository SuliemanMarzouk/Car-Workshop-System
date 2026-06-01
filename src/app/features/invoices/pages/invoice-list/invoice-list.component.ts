import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CURRENCY_CODES, CurrencyCode } from '@core/currency/currency';
import { CurrencyService } from '@core/currency/currency.service';
import { LanguageService } from '@core/i18n/language.service';
import { LucideAngularModule, Download, Eye, Plus, Search } from 'lucide-angular';
import { InvoiceRepository } from '@features/invoices/data/invoice.repository';
import { Invoice, InvoiceBillingForm } from '@features/invoices/models/invoice.model';
import { WorkOrderRepository } from '@features/work-orders/data/work-order.repository';
import { WorkOrder } from '@features/work-orders/models/work-order.model';
import { ModalComponent } from '@shared/ui/modal/modal.component';
import { InvoiceDocumentComponent } from '@features/invoices/ui/invoice-document/invoice-document.component';
import { InvoicePrintService } from '@features/invoices/services/invoice-print.service';
import { InvoiceBillingService, InvoiceTotals } from '@features/invoices/services/invoice-billing.service';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    LucideAngularModule,
    ModalComponent,
    InvoiceDocumentComponent,
  ],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
})
export class InvoiceListComponent implements OnInit {
  private readonly invoiceRepository = inject(InvoiceRepository);
  private readonly workOrderRepository = inject(WorkOrderRepository);
  private readonly invoicePrint = inject(InvoicePrintService);
  readonly billing = inject(InvoiceBillingService);
  readonly currencyService = inject(CurrencyService);
  private readonly translate = inject(TranslateService);
  private readonly language = inject(LanguageService);

  readonly currencyOptions = CURRENCY_CODES;

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
  readonly selectedWorkOrder = signal<WorkOrder | null>(null);
  readonly previewInvoice = signal<Invoice | null>(null);
  readonly loadingWorkOrder = signal(false);
  readonly submitting = signal(false);
  readonly errors = signal<Record<string, string[]>>({});
  readonly submitError = signal<string | null>(null);
  readonly billingFormVersion = signal(0);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);

  workOrderId = '';
  billingForm: InvoiceBillingForm = this.billing.defaultBillingForm(null);

  readonly canSubmit = computed(() => {
    this.billingFormVersion();
    return (
      !!this.workOrderId &&
      this.billing.canInvoiceWorkOrder(this.selectedWorkOrder(), this.billingForm)
    );
  });

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
          response.data.filter(
            (order) => order.status === 'approved' && !this.workOrderHasInvoice(order),
          ),
        );
      },
    });
  }

  onWorkOrderChange(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    this.workOrderId = id;

    const numericId = Number(id);
    if (id && (!Number.isFinite(numericId) || numericId <= 0)) {
      this.submitError.set('Invalid work order selected.');
      return;
    }
    this.errors.set({});
    this.submitError.set(null);
    this.previewInvoice.set(null);

    if (!id) {
      this.selectedWorkOrder.set(null);
      this.billingForm = this.billing.defaultBillingForm(null);
      this.bumpBillingForm();
      return;
    }

    this.loadingWorkOrder.set(true);
    this.workOrderRepository.getById(numericId).subscribe({
      next: (raw) => {
        const workOrder = this.billing.normalizeWorkOrder(raw);
        this.selectedWorkOrder.set(workOrder);
        this.billingForm = this.billing.defaultBillingForm(workOrder);
        this.loadingWorkOrder.set(false);
        this.bumpBillingForm();
        this.refreshPreview();
      },
      error: () => {
        this.selectedWorkOrder.set(null);
        this.billingForm = this.billing.defaultBillingForm(null);
        this.loadingWorkOrder.set(false);
        this.previewInvoice.set(null);
        this.bumpBillingForm();
        this.submitError.set('Failed to load work order.');
      },
    });
  }

  onBillingChanged(): void {
    this.bumpBillingForm();
    this.refreshPreview();
  }

  onDiscountTypeChange(): void {
    if (this.billingForm.discountType === 'percent' && this.billingForm.discountValue > 100) {
      this.billingForm.discountValue = 100;
    }
    this.onBillingChanged();
  }

  discountInputMax(): number | null {
    return this.billingForm.discountType === 'percent' ? 100 : null;
  }

  discountInputStep(): string {
    return this.billingForm.discountType === 'percent' ? '0.01' : '0.01';
  }

  discountRowLabel(totals: InvoiceTotals): string {
    return this.billing.formatDiscountLabel(
      {
        discount_type: this.billingForm.discountType,
        discount_value: this.billingForm.discountValue,
        discount_amount: totals.discount,
      },
      this.translate.instant('invoice.template.discount'),
      this.language.language(),
    );
  }

  bumpBillingForm(): void {
    this.billingFormVersion.update((value) => value + 1);
  }

  refreshPreview(): void {
    const workOrder = this.selectedWorkOrder();
    if (!workOrder || !this.billingForm.billToName.trim()) {
      this.previewInvoice.set(null);
      return;
    }

    const items = this.billing.normalizeItems(workOrder.items);
    if (items.length === 0) {
      this.previewInvoice.set(null);
      return;
    }

    const normalized: WorkOrder = { ...workOrder, items };
    this.previewInvoice.set(
      this.billing.buildDraftInvoice(normalized, {
        billing: this.billingForm,
        baseCurrency: this.baseCurrency(),
      }),
    );
  }

  baseCurrency(): CurrencyCode {
    return this.currencyService.systemCurrency();
  }

  onInvoiceCurrencyChange(): void {
    this.syncExchangeRateForCurrency();
    this.onBillingChanged();
  }

  onExchangeRateInput(): void {
    if (this.billingForm.exchangeRate <= 0) {
      this.billingForm.exchangeRate = 1;
    }
    this.onBillingChanged();
  }

  exchangeRateLocked(): boolean {
    return this.billingForm.currency === this.baseCurrency();
  }

  formatWithCurrency(value: number, code?: CurrencyCode): string {
    return this.currencyService.formatAmount(value, code ?? this.billingForm.currency);
  }

  invoiceCurrencySymbol(code?: CurrencyCode): string {
    return this.currencyService.symbol(code ?? this.billingForm.currency);
  }

  lineItemAmount(price: string | number): number {
    return this.billing.convertBaseAmount(
      parseFloat(String(price)) || 0,
      this.billing.exchangeRateValue(this.billingForm.exchangeRate),
    );
  }

  private syncExchangeRateForCurrency(): void {
    if (this.billingForm.currency === this.baseCurrency()) {
      this.billingForm.exchangeRate = 1;
      return;
    }

    this.billingForm.exchangeRate = this.currencyService.suggestedExchangeRate(
      this.baseCurrency(),
      this.billingForm.currency,
    );
  }

  draftTotals(): InvoiceTotals | null {
    const workOrder = this.selectedWorkOrder();
    if (!workOrder) {
      return null;
    }

    const items = this.billing.normalizeItems(workOrder.items);
    if (items.length === 0) {
      return null;
    }

    return this.billing.computeTotals(
      items,
      {
        discountType: this.billingForm.discountType,
        discountValue: this.billingForm.discountValue,
      },
      { exchangeRate: this.billing.exchangeRateValue(this.billingForm.exchangeRate) },
    );
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.submitError.set(null);
    this.errors.set({});

    if (!this.workOrderId) {
      this.submitError.set('Select a work order.');
      return;
    }

    if (!this.billing.canInvoiceWorkOrder(this.selectedWorkOrder(), this.billingForm)) {
      this.submitError.set('Complete bill-to and ensure the work order has priced line items.');
      this.refreshPreview();
      return;
    }

    this.submitting.set(true);

    const payload = {
      work_order_id: Number(this.workOrderId),
      bill_to_name: this.billingForm.billToName.trim(),
      bill_to_address: this.billingForm.billToAddress.trim() || undefined,
      discount_type: this.billingForm.discountType,
      discount_value: Number(this.billingForm.discountValue) || 0,
      notes: this.billingForm.notes.trim() || undefined,
      currency: this.billingForm.currency,
      base_currency: this.baseCurrency(),
      exchange_rate: this.billing.exchangeRateValue(this.billingForm.exchangeRate),
    };

    this.invoiceRepository.create(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.closeCreateModal();
        this.fetchInvoices();
      },
      error: (error: {
        error?: { errors?: Record<string, string[]>; message?: string };
        message?: string;
      }) => {
        this.submitting.set(false);
        if (error.error?.errors) {
          this.errors.set(error.error.errors);
        } else {
          this.submitError.set(
            error.error?.message ?? error.message ?? 'Could not issue invoice.',
          );
        }
      },
    });
  }

  handleViewDetails(invoice: Invoice): void {
    this.invoiceRepository.getById(invoice.id).subscribe({
      next: (full) => this.selectedInvoice.set(full),
      error: () => this.selectedInvoice.set(invoice),
    });
  }

  closeDetails(): void {
    this.selectedInvoice.set(null);
  }

  downloadInvoice(invoice: Invoice): void {
    const runPrint = (inv: Invoice) => {
      const normalized: Invoice = {
        ...inv,
        work_order: inv.work_order
          ? this.billing.normalizeWorkOrder(inv.work_order)
          : inv.work_order,
      };
      this.invoicePrint.print(normalized);
    };

    if (invoice.work_order?.car) {
      runPrint(invoice);
      return;
    }

    this.invoiceRepository.getById(invoice.id).subscribe({
      next: runPrint,
      error: () => runPrint(invoice),
    });
  }

  onAddModalOpen(): void {
    this.isAddModalOpen.set(true);
    this.workOrderId = '';
    this.selectedWorkOrder.set(null);
    this.previewInvoice.set(null);
    this.billingForm = this.billing.defaultBillingForm(null);
    this.errors.set({});
    this.submitError.set(null);
    this.bumpBillingForm();
    this.fetchWorkOrders();
  }

  closeCreateModal(): void {
    this.isAddModalOpen.set(false);
    this.workOrderId = '';
    this.selectedWorkOrder.set(null);
    this.previewInvoice.set(null);
    this.billingForm = this.billing.defaultBillingForm(null);
    this.errors.set({});
    this.submitError.set(null);
    this.bumpBillingForm();
  }

  formatInvoiceNumber(id: number): string {
    return this.billing.formatInvoiceNumber(id);
  }

  formatInvoiceTotal(invoice: Invoice): string {
    const code = this.currencyService.resolveInvoiceCurrency(invoice);
    return this.currencyService.formatAmount(parseFloat(String(invoice.total)) || 0, code);
  }

  private workOrderHasInvoice(order: WorkOrder): boolean {
    const invoice = order.invoice;
    return invoice != null && typeof invoice === 'object' && 'id' in invoice && !!invoice.id;
  }

  get filteredInvoices(): Invoice[] {
    const term = this.searchTerm().toLowerCase();
    return this.invoices().filter((invoice) => {
      const plate = invoice.work_order?.car?.plate_number?.toLowerCase() ?? '';
      const owner = invoice.work_order?.car?.owner_name?.toLowerCase() ?? '';
      const billTo = invoice.bill_to_name?.toLowerCase() ?? '';

      return (
        invoice.id.toString().includes(term) ||
        this.formatInvoiceNumber(invoice.id).toLowerCase().includes(term) ||
        plate.includes(term) ||
        owner.includes(term) ||
        billTo.includes(term)
      );
    });
  }
}
