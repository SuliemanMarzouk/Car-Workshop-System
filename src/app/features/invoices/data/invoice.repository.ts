import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiClient } from '@core/http/api-client.service';
import { unwrapResource } from '@core/http/api-response.util';
import { PaginatedResponse } from '@shared/models/paginated-response.model';
import { CreateInvoicePayload, Invoice } from '@features/invoices/models/invoice.model';

@Injectable({ providedIn: 'root' })
export class InvoiceRepository {
  private readonly api = inject(ApiClient);

  list(page = 1): Observable<PaginatedResponse<Invoice>> {
    return this.api.getPaginated<Invoice>('/invoices', page);
  }

  getById(id: number): Observable<Invoice> {
    return this.api.get<Invoice | { data: Invoice }>(`/invoices/${id}`).pipe(
      map((response) => unwrapResource(response)),
    );
  }

  create(payload: CreateInvoicePayload): Observable<Invoice> {
    return this.api.post<Invoice | { data: Invoice }>('/invoices', payload).pipe(
      map((response) => unwrapResource(response)),
    );
  }
}
