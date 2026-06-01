import { Car } from '@features/cars/models/car.model';

export type WorkOrderStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface WorkOrderItem {
  id?: number;
  description: string;
  status?: string;
  price?: number | string | null;
}

export interface WorkOrder {
  id: number;
  car?: Car;
  status: WorkOrderStatus;
  created_by?: string | null;
  approved_by?: string | null;
  items?: WorkOrderItem[];
  invoice?: { id: number } | null;
  created_at?: string;
}

export interface CreateWorkOrderPayload {
  car_id: number | string;
  items: WorkOrderItem[];
}

export interface UpdateWorkOrderPayload {
  status: WorkOrderStatus;
}
