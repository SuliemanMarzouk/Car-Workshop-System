import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PauseCircle, LucideAngularModule } from 'lucide-angular';
import { buildMainOriginUrl } from '@core/workshop/tenant-context';

@Component({
  selector: 'app-workshop-suspended',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule],
  templateUrl: './workshop-suspended.component.html',
})
export class WorkshopSuspendedComponent {
  private readonly route = inject(ActivatedRoute);

  readonly PauseCircle = PauseCircle;
  readonly workshopName = this.route.snapshot.queryParamMap.get('name') ?? '';
  readonly platformUrl = buildMainOriginUrl('/platform/login');
}
