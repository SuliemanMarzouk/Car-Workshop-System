import { Injectable, computed, inject } from '@angular/core';
import { CurrencyCode } from '@core/currency/currency';
import { CurrencyService } from '@core/currency/currency.service';
import { WorkshopProfileService } from '@core/workshop/workshop-profile.service';
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

export interface InvoiceTotalsOptions {
  exchangeRate?: number;
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
  baseCurrency: CurrencyCode;
}

@Injectable({ providedIn: 'root' })
export class InvoiceBillingService {
  private readonly currencyService = inject(CurrencyService);
  private readonly profileService = inject(WorkshopProfileService);

  readonly vatRate = computed(() => this.profileService.profile().vatRate);
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

  exchangeRateValue(rate: number | string | undefined | null): number {
    const parsed = parseFloat(String(rate));
    return parsed > 0 ? parsed : 1;
  }

  resolveDiscountAmount(
    subtotalBase: number,
    discount: InvoiceDiscountInput,
    exchangeRate = 1,
  ): number {
    const value = parseFloat(String(discount.discountValue)) || 0;
    if (value <= 0 || subtotalBase <= 0) {
      return 0;
    }

    const rate = Math.max(exchangeRate, 0.000001);

    if (discount.discountType === 'percent') {
      const percent = Math.min(Math.max(value, 0), 100);
      return this.round(Math.min((subtotalBase * percent) / 100, subtotalBase));
    }

    const discountBase = this.round(value / rate);
    return this.round(Math.min(Math.max(discountBase, 0), subtotalBase));
  }

  computeTotals(
    items: WorkOrderItem[],
    discount: InvoiceDiscountInput | number | string = 0,
    options: InvoiceTotalsOptions = {},
  ): InvoiceTotals {
    const discountInput: InvoiceDiscountInput =
      typeof discount === 'object' && discount !== null && 'discountType' in discount
        ? discount
        : { discountType: 'amount', discountValue: discount };

    const rate = Math.max(options.exchangeRate ?? 1, 0.000001);
    const vatRate = this.vatRate();

    const subtotalBase = this.round(
      items.reduce((sum, item) => sum + (parseFloat(String(item.price)) || 0), 0),
    );
    const discountBase = this.resolveDiscountAmount(subtotalBase, discountInput, rate);
    const taxableBase = this.round(subtotalBase - discountBase);
    const taxBase = this.round(taxableBase * vatRate);
    const totalBase = this.round(taxableBase + taxBase);

    return {
      subtotal: this.round(subtotalBase * rate),
      discount: this.round(discountBase * rate),
      taxable: this.round(taxableBase * rate),
      tax: this.round(taxBase * rate),
      total: this.round(totalBase * rate),
      taxRatePercent: this.round(vatRate * 100),
    };
  }

  convertBaseAmount(amount: number, exchangeRate: number): number {
    return this.round(amount * Math.max(exchangeRate, 0.000001));
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
      return `${baseLabel} (${pct})`;
    }

    return baseLabel;
  }

  formatPercent(value: number, lang: 'ar' | 'en'): string {
    const formatted = value % 1 === 0 ? String(value) : value.toFixed(2);
    return `${formatted}%`;
  }

  buildDraftInvoice(workOrder: WorkOrder, options: BuildDraftOptions): Invoice {
    const items = this.normalizeItems(workOrder.items);
    const rate = this.exchangeRateValue(options.billing.exchangeRate);
    const totals = this.computeTotals(
      items,
      {
        discountType: options.billing.discountType,
        discountValue: options.billing.discountValue,
      },
      { exchangeRate: rate },
    );

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
      currency: options.billing.currency,
      base_currency: options.baseCurrency,
      exchange_rate: rate,
      work_order: { ...workOrder, items },
      created_at: new Date().toISOString(),
    };
  }

  defaultBillingForm(workOrder: WorkOrder | null): InvoiceBillingForm {
    const base = this.currencyService.systemCurrency();
    return {
      billToName: workOrder?.car?.owner_name?.trim() ?? '',
      billToAddress: '',
      discountType: 'amount',
      discountValue: 0,
      notes: '',
      currency: base,
      exchangeRate: 1,
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

    const rate = this.exchangeRateValue(billing.exchangeRate);
    const totals = this.computeTotals(
      items,
      {
        discountType: billing.discountType,
        discountValue: billing.discountValue,
      },
      { exchangeRate: rate },
    );
    return totals.subtotal > 0;
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
