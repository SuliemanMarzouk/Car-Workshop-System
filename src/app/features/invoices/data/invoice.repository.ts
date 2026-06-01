import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '@core/http/api-client.service';
import { PaginatedResponse } from '@shared/models/paginated-response.model';
import { CreateInvoicePayload, Invoice } from '@features/invoices/models/invoice.model';

@Injectable({ providedIn: 'root' })
export class InvoiceRepository {
  private readonly api = inject(ApiClient);

  list(page = 1): Observable<PaginatedResponse<Invoice>> {
    return this.api.getPaginated<Invoice>('/invoices', page);
  }

  getById(id: number): Observable<Invoice> {
    return this.api.get<Invoice>(`/invoices/${id}`);
  }

  create(payload: CreateInvoicePayload): Observable<Invoice> {
    return this.api.post<Invoice>('/invoices', payload);
  }
}
