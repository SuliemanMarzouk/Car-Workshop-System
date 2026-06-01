import { WorkOrder } from '@features/work-orders/models/work-order.model';

export interface Invoice {
  id: number;
  work_order_id: number;
  subtotal: string | number;
  tax: string | number;
  total: string | number;
  work_order?: WorkOrder;
  created_at?: string;
}

export interface CreateInvoicePayload {
  work_order_id: number | string;
  subtotal: string;
  tax: string;
  total: string;
}
