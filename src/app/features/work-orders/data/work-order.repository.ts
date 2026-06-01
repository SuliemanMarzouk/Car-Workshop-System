import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiClient } from '@core/http/api-client.service';
import { unwrapResource } from '@core/http/api-response.util';
import { PaginatedResponse } from '@shared/models/paginated-response.model';
import {
  CreateWorkOrderPayload,
  UpdateWorkOrderPayload,
  WorkOrder,
} from '@features/work-orders/models/work-order.model';

@Injectable({ providedIn: 'root' })
export class WorkOrderRepository {
  private readonly api = inject(ApiClient);

  list(page = 1): Observable<PaginatedResponse<WorkOrder>> {
    return this.api.getPaginated<WorkOrder>('/work-orders', page);
  }

  getById(id: number): Observable<WorkOrder> {
    return this.api.get<WorkOrder | { data: WorkOrder }>(`/work-orders/${id}`).pipe(
      map((response) => unwrapResource(response)),
    );
  }

  create(payload: CreateWorkOrderPayload): Observable<WorkOrder> {
    return this.api.post<WorkOrder>('/work-orders', payload);
  }

  update(id: number, payload: UpdateWorkOrderPayload): Observable<WorkOrder> {
    return this.api.put<WorkOrder>(`/work-orders/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/work-orders/${id}`);
  }
}
