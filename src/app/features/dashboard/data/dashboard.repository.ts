import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '@core/http/api-client.service';

export interface DashboardStats {
  total_cars: number;
  pending_work_orders: number;
  approved_work_orders: number;
  invoices_total_today: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardRepository {
  private readonly api = inject(ApiClient);

  getStats(): Observable<DashboardStats> {
    return this.api.get<DashboardStats>('/dashboard/stats');
  }
}
