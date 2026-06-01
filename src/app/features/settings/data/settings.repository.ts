import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '@core/http/api-client.service';
import {
  UpdateWorkshopSettingsPayload,
  WorkshopConfig,
  WorkshopSettings,
} from '@features/settings/models/settings.model';

@Injectable({ providedIn: 'root' })
export class SettingsRepository {
  private readonly api = inject(ApiClient);

  getSettings(): Observable<WorkshopSettings> {
    return this.api.get<WorkshopSettings>('/settings');
  }

  getWorkshopConfig(): Observable<WorkshopConfig> {
    return this.api.get<WorkshopConfig>('/settings/workshop');
  }

  updateSettings(payload: UpdateWorkshopSettingsPayload): Observable<WorkshopSettings> {
    return this.api.put<WorkshopSettings>('/settings', payload);
  }
}
