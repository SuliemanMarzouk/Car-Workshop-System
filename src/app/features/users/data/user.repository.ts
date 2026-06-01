import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '@core/http/api-client.service';
import { RoleRepository } from '@features/roles/data/role.repository';
import { PaginatedResponse } from '@shared/models/paginated-response.model';
import {
  CreateTeamUserPayload,
  RoleOption,
  TeamUser,
  UpdateTeamUserPayload,
} from '@features/users/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserRepository {
  private readonly api = inject(ApiClient);
  private readonly roles = inject(RoleRepository);

  list(page = 1): Observable<PaginatedResponse<TeamUser>> {
    return this.api.getPaginated<TeamUser>('/users', page);
  }

  listRoles(): Observable<RoleOption[]> {
    return this.roles.list();
  }

  create(payload: CreateTeamUserPayload): Observable<TeamUser> {
    return this.api.post<TeamUser>('/users', payload);
  }

  update(id: number, payload: UpdateTeamUserPayload): Observable<TeamUser> {
    return this.api.put<TeamUser>(`/users/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/users/${id}`);
  }
}
