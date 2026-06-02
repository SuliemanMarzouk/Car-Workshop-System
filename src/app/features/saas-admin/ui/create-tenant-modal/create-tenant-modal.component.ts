import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Loader2, LucideAngularModule, X } from 'lucide-angular';
import {
  CreateTenantPayload,
  DEFAULT_CREATE_TENANT_FORM,
} from '../../models/saas-admin.models';
import { SaaSAdminStateService } from '../../services/saas-admin-state.service';

@Component({
  selector: 'app-create-tenant-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule],
  templateUrl: './create-tenant-modal.component.html',
  styleUrl: '../../styles/platform-content.scss',
})
export class CreateTenantModalComponent {
  readonly open = input(false);
  readonly closed = output<void>();

  private readonly state = inject(SaaSAdminStateService);

  readonly X = X;
  readonly Loader2 = Loader2;
  readonly loading = this.state.actionLoading;

  form: CreateTenantPayload = { ...DEFAULT_CREATE_TENANT_FORM };

  close(): void {
    this.closed.emit();
  }

  onWorkshopNameChange(): void {
    if (!this.form.id.trim() && this.form.workshop_name.trim()) {
      this.form.id = this.form.workshop_name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 63);
    }
  }

  async submit(): Promise<void> {
    const ok = await this.state.createTenant({
      ...this.form,
      id: this.form.id.trim(),
      workshop_name: this.form.workshop_name.trim(),
      domain: this.form.domain?.trim() || undefined,
      vat_rate: Number(this.form.vat_rate),
    });

    if (ok) {
      this.form = { ...DEFAULT_CREATE_TENANT_FORM };
      this.close();
    }
  }
}
