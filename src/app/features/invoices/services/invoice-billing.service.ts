import { inject, Injectable } from '@angular/core';
import { Invoice, InvoiceBillingForm } from '@features/invoices/models/invoice.model';
import { WorkOrder, WorkOrderItem } from '@features/work-orders/models/work-order.model';
import { InvoicePrintService } from '@features/invoices/services/invoice-print.service';

export interface InvoiceTotals {
  subtotal: number;
  discount: number;
  taxable: number;
  tax: number;
  total: number;
  taxRatePercent: number;
}

export interface BuildDraftOptions {
  billing: InvoiceBillingForm;
}

@Injectable({ providedIn: 'root' })
export class InvoiceBillingService {
  private readonly printService = inject(InvoicePrintService);

  readonly vatRate = 0.15;
  readonly paymentTermDays = 15;

  normalizeItems(items: WorkOrderItem[] | Record<string, WorkOrderItem> | null | undefined): WorkOrderItem[] {
    if (!items) {
      return [];
    }

    if (Array.isArray(items)) {
      return items;
    }

    return Object.values(items);
  }

  normalizeWorkOrder(workOrder: WorkOrder): WorkOrder {
    return {
      ...workOrder,
      items: this.normalizeItems(workOrder.items),
    };
  }

  computeTotals(items: WorkOrderItem[], discountAmount: number | string = 0): InvoiceTotals {
    const discountInput = parseFloat(String(discountAmount)) || 0;
    const subtotal = this.round(
      items.reduce((sum, item) => sum + (parseFloat(String(item.price)) || 0), 0),
    );
    const discount = this.round(Math.min(Math.max(discountInput, 0), subtotal));
    const taxable = this.round(subtotal - discount);
    const tax = this.round(taxable * this.vatRate);
    const total = this.round(taxable + tax);

    return {
      subtotal,
      discount,
      taxable,
      tax,
      total,
      taxRatePercent: this.vatRate * 100,
    };
  }

  buildDraftInvoice(workOrder: WorkOrder, options: BuildDraftOptions): Invoice {
    const items = this.normalizeItems(workOrder.items);
    const totals = this.computeTotals(items, options.billing.discountAmount);

    return {
      id: 0,
      work_order_id: workOrder.id,
      bill_to_name: options.billing.billToName.trim(),
      bill_to_address: options.billing.billToAddress.trim() || null,
      discount_amount: totals.discount,
      subtotal: totals.subtotal.toFixed(2),
      tax: totals.tax.toFixed(2),
      total: totals.total.toFixed(2),
      notes: options.billing.notes.trim() || null,
      work_order: { ...workOrder, items },
      created_at: new Date().toISOString(),
    };
  }

  defaultBillingForm(workOrder: WorkOrder | null): InvoiceBillingForm {
    return {
      billToName: workOrder?.car?.owner_name?.trim() ?? '',
      billToAddress: '',
      discountAmount: 0,
      notes: '',
    };
  }

  formatInvoiceNumber(id: number, draft = false): string {
    const year = new Date().getFullYear();

    if (draft || id <= 0) {
      return `INV-${year}-DRAFT`;
    }

    return `INV-${year}-${String(id).padStart(5, '0')}`;
  }

  formatMoney(value: number): string {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  canInvoiceWorkOrder(workOrder: WorkOrder | null | undefined, billing?: InvoiceBillingForm): boolean {
    if (!workOrder || workOrder.status !== 'approved' || workOrder.invoice) {
      return false;
    }

    const items = this.normalizeItems(workOrder.items);
    if (items.length === 0) {
      return false;
    }

    if (!billing?.billToName?.trim()) {
      return false;
    }

    const totals = this.computeTotals(items, billing?.discountAmount ?? 0);
    return totals.subtotal > 0;
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
