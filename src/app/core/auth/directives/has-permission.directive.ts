import {
  Directive,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
} from '@angular/core';
import { Permission } from '@core/auth/models/permission';
import { PermissionService } from '@core/auth/services/permission.service';
import { AuthService } from '@core/auth/services/auth.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class HasPermissionDirective implements OnDestroy {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly permissionService = inject(PermissionService);
  private readonly authService = inject(AuthService);

  @Input({ required: true }) appHasPermission!: Permission | string;

  private readonly effectRef = effect(() => {
    this.authService.user();
    this.updateView();
  });

  ngOnDestroy(): void {
    this.effectRef.destroy();
  }

  private updateView(): void {
    this.viewContainer.clear();

    if (this.permissionService.has(this.appHasPermission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
