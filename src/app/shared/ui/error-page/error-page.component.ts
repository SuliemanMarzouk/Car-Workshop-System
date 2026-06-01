import { Location, NgClass } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ArrowLeft,
  Home,
  LucideAngularModule,
  MapPinOff,
  ShieldX,
  type LucideIconData,
} from 'lucide-angular';
import { PermissionService } from '@core/auth/services/permission.service';

export type ErrorPageVariant = 'forbidden' | 'not_found';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [NgClass, TranslateModule, LucideAngularModule, RouterLink],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css',
})
export class ErrorPageComponent {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly permissions = inject(PermissionService);

  readonly variant = input.required<ErrorPageVariant>();

  readonly ArrowLeft = ArrowLeft;
  readonly Home = Home;

  readonly config = computed(() => {
    const v = this.variant();

    if (v === 'forbidden') {
      return {
        code: '403',
        icon: ShieldX as LucideIconData,
        accentClass: 'error-accent-forbidden',
        headingKey: 'errors.forbidden.heading',
        messageKey: 'errors.forbidden.message',
      };
    }

    return {
      code: '404',
      icon: MapPinOff as LucideIconData,
      accentClass: 'error-accent-not-found',
      headingKey: 'errors.not_found.heading',
      messageKey: 'errors.not_found.message',
    };
  });

  readonly homeRoute = computed(() => this.permissions.defaultRoute());

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }

    void this.router.navigateByUrl(this.homeRoute());
  }
}
