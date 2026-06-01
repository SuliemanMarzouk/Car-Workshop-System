import { WorkOrder } from '@features/work-orders/models/work-order.model';

export interface Invoice {
  id: number;
  work_order_id: number;
  bill_to_name?: string;
  bill_to_address?: string | null;
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
  discount_amount: number;
  notes?: string;
}

export interface InvoiceBillingForm {
  billToName: string;
  billToAddress: string;
  discountAmount: number;
  notes: string;
}
