import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '@core/config/api.config';

export interface WorkshopResolveResult {
  exists: boolean;
  accessible: boolean;
  id?: string;
  name?: string;
  status?: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class WorkshopResolveService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  async resolve(tenantId: string): Promise<WorkshopResolveResult> {
    try {
      return await firstValueFrom(
        this.http.get<WorkshopResolveResult>(
          `${this.baseUrl}/public/workshops/${encodeURIComponent(tenantId)}`,
        ),
      );
    } catch (error: unknown) {
      const status = (error as { status?: number })?.status;
      const body = (error as { error?: WorkshopResolveResult })?.error;

      if (status === 404) {
        return {
          exists: false,
          accessible: false,
          message: body?.message,
        };
      }

      if (status === 403 && body) {
        return { ...body, exists: true, accessible: false };
      }

      throw error;
    }
  }
}
