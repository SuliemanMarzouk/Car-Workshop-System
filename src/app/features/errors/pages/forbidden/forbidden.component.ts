import { Component } from '@angular/core';
import { ErrorPageComponent } from '@shared/ui/error-page/error-page.component';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [ErrorPageComponent],
  template: `<app-error-page variant="forbidden" />`,
})
export class ForbiddenComponent {}
