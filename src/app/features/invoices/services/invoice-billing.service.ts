import { Injectable } from '@angular/core';
import {
  Invoice,
  InvoiceBillingForm,
  InvoiceDiscountType,
} from '@features/invoices/models/invoice.model';
import { WorkOrder, WorkOrderItem } from '@features/work-orders/models/work-order.model';
export interface InvoiceDiscountInput {
  discountType: InvoiceDiscountType;
  discountValue: number | string;
}

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

  resolveDiscountAmount(subtotal: number, discount: InvoiceDiscountInput): number {
    const value = parseFloat(String(discount.discountValue)) || 0;
    if (value <= 0 || subtotal <= 0) {
      return 0;
    }

    if (discount.discountType === 'percent') {
      const percent = Math.min(Math.max(value, 0), 100);
      return this.round(Math.min((subtotal * percent) / 100, subtotal));
    }

    return this.round(Math.min(Math.max(value, 0), subtotal));
  }

  computeTotals(items: WorkOrderItem[], discount: InvoiceDiscountInput | number | string = 0): InvoiceTotals {
    const discountInput: InvoiceDiscountInput =
      typeof discount === 'object' && discount !== null && 'discountType' in discount
        ? discount
        : { discountType: 'amount', discountValue: discount };

    const subtotal = this.round(
      items.reduce((sum, item) => sum + (parseFloat(String(item.price)) || 0), 0),
    );
    const discountAmount = this.resolveDiscountAmount(subtotal, discountInput);
    const taxable = this.round(subtotal - discountAmount);
    const tax = this.round(taxable * this.vatRate);
    const total = this.round(taxable + tax);

    return {
      subtotal,
      discount: discountAmount,
      taxable,
      tax,
      total,
      taxRatePercent: this.vatRate * 100,
    };
  }

  formatDiscountLabel(
    invoice: Pick<Invoice, 'discount_type' | 'discount_value' | 'discount_amount'>,
    baseLabel: string,
    lang: 'ar' | 'en' = 'ar',
  ): string {
    const type = invoice.discount_type ?? 'amount';
    const value = parseFloat(String(invoice.discount_value)) || 0;
    const amount = parseFloat(String(invoice.discount_amount)) || 0;

    if (amount <= 0) {
      return baseLabel;
    }

    if (type === 'percent' && value > 0) {
      const pct = this.formatPercent(value, lang);
      return lang === 'ar' ? `${baseLabel} (${pct})` : `${baseLabel} (${pct})`;
    }

    return baseLabel;
  }

  formatPercent(value: number, lang: 'ar' | 'en'): string {
    const formatted = value % 1 === 0 ? String(value) : value.toFixed(2);
    return lang === 'ar' ? `${formatted}%` : `${formatted}%`;
  }

  buildDraftInvoice(workOrder: WorkOrder, options: BuildDraftOptions): Invoice {
    const items = this.normalizeItems(workOrder.items);
    const totals = this.computeTotals(items, {
      discountType: options.billing.discountType,
      discountValue: options.billing.discountValue,
    });

    return {
      id: 0,
      work_order_id: workOrder.id,
      bill_to_name: options.billing.billToName.trim(),
      bill_to_address: options.billing.billToAddress.trim() || null,
      discount_type: options.billing.discountType,
      discount_value: options.billing.discountValue,
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
      discountType: 'amount',
      discountValue: 0,
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

    const totals = this.computeTotals(items, {
      discountType: billing?.discountType ?? 'amount',
      discountValue: billing?.discountValue ?? 0,
    });
    return totals.subtotal > 0;
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
