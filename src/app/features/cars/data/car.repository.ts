import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '@core/http/api-client.service';
import { PaginatedResponse } from '@shared/models/paginated-response.model';
import { Car, CreateCarPayload } from '@features/cars/models/car.model';

@Injectable({ providedIn: 'root' })
export class CarRepository {
  private readonly api = inject(ApiClient);

  list(page = 1): Observable<PaginatedResponse<Car>> {
    return this.api.getPaginated<Car>('/cars', page);
  }

  getById(id: number): Observable<Car> {
    return this.api.get<Car>(`/cars/${id}`);
  }

  create(payload: CreateCarPayload): Observable<Car> {
    return this.api.post<Car>('/cars', payload);
  }

  update(id: number, payload: Partial<CreateCarPayload>): Observable<Car> {
    return this.api.put<Car>(`/cars/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/cars/${id}`);
  }
}
