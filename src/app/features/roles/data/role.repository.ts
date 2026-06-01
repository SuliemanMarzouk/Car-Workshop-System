import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiClient } from '@core/http/api-client.service';
import {
  ManagedRole,
  PermissionDefinition,
  RoleFormPayload,
} from '@features/roles/models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleRepository {
  private readonly api = inject(ApiClient);

  list(): Observable<ManagedRole[]> {
    return this.normalizeList(this.api.get<ManagedRole[] | { data: ManagedRole[] }>('/roles'));
  }

  listPermissions(): Observable<PermissionDefinition[]> {
    return this.normalizeList(
      this.api.get<PermissionDefinition[] | { data: PermissionDefinition[] }>('/permissions'),
    );
  }

  create(payload: RoleFormPayload): Observable<ManagedRole> {
    return this.api.post<ManagedRole>('/roles', payload);
  }

  update(id: number, payload: RoleFormPayload): Observable<ManagedRole> {
    return this.api.put<ManagedRole>(`/roles/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/roles/${id}`);
  }

  private normalizeList<T>(source: Observable<T[] | { data: T[] }>): Observable<T[]> {
    return source.pipe(
      map((response) => (Array.isArray(response) ? response : (response.data ?? []))),
    );
  }
}
