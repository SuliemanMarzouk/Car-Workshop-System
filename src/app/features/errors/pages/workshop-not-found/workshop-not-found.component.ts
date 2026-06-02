import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AlertCircle, LucideAngularModule } from 'lucide-angular';
import { buildMainOriginUrl } from '@core/workshop/tenant-context';

@Component({
  selector: 'app-workshop-not-found',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule],
  templateUrl: './workshop-not-found.component.html',
})
export class WorkshopNotFoundComponent {
  private readonly route = inject(ActivatedRoute);

  readonly AlertCircle = AlertCircle;
  readonly workshopId = this.route.snapshot.queryParamMap.get('id') ?? '';
  readonly platformUrl = buildMainOriginUrl('/platform/login');
}
