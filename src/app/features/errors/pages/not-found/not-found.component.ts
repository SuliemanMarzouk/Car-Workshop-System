import { Component } from '@angular/core';
import { ErrorPageComponent } from '@shared/ui/error-page/error-page.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [ErrorPageComponent],
  template: `<app-error-page variant="not_found" />`,
})
export class NotFoundComponent {}
