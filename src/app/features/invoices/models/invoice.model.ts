import { WorkOrder } from '@features/work-orders/models/work-order.model';

export type InvoiceDiscountType = 'amount' | 'percent';

export interface Invoice {
  id: number;
  work_order_id: number;
  bill_to_name?: string;
  bill_to_address?: string | null;
  discount_type?: InvoiceDiscountType;
  discount_value?: string | number;
  discount_amount?: string | number;
  subtotal: string | number;
  tax: string | number;
  total: string | number;
  notes?: string | null;
  work_order?: WorkOrder;
  created_at?: string;
}

export interface CreateInvoicePayload {
  work_order_id: number;
  bill_to_name: string;
  bill_to_address?: string;
  discount_type: InvoiceDiscountType;
  discount_value: number;
  notes?: string;
}

export interface InvoiceBillingForm {
  billToName: string;
  billToAddress: string;
  discountType: InvoiceDiscountType;
  discountValue: number;
  notes: string;
}
