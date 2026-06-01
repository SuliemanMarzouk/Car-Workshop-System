import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, Printer } from 'lucide-angular';
import { LanguageService } from '@core/i18n/language.service';
import { Car } from '@features/cars/models/car.model';
import { CarQrPrintLabels } from '@features/cars/models/car-qr.model';
import { CarQrPrintService } from '@features/cars/services/car-qr-print.service';
import { ModalComponent } from '@shared/ui/modal/modal.component';

@Component({
  selector: 'app-car-qr-print-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule, ModalComponent],
  templateUrl: './car-qr-print-modal.component.html',
  styleUrl: './car-qr-print-modal.component.scss',
})
export class CarQrPrintModalComponent {
  private readonly qrPrint = inject(CarQrPrintService);
  private readonly translate = inject(TranslateService);
  private readonly language = inject(LanguageService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly Printer = Printer;

  readonly isOpen = input(false);
  readonly car = input<Car | null>(null);
  readonly closed = output<void>();

  readonly previewUrl = signal<SafeResourceUrl | null>(null);
  readonly previewLoading = signal(false);
  readonly printing = signal(false);

  constructor() {
    effect(() => {
      const open = this.isOpen();
      const vehicle = this.car();
      if (open && vehicle) {
        void this.refreshPreview();
      } else if (!open) {
        this.previewUrl.set(null);
      }
    });
  }

  close(): void {
    this.closed.emit();
  }

  async refreshPreview(): Promise<void> {
    const vehicle = this.car();
    if (!vehicle) {
      return;
    }

    this.previewLoading.set(true);
    try {
      const html = await this.qrPrint.buildPrintDocument(
        this.qrPrint.createContext(vehicle, this.labels(), this.language.language()),
      );
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const prev = this.previewUrl();
      if (prev) {
        const raw = (prev as { changingThisBreaksApplicationSecurity?: string })
          .changingThisBreaksApplicationSecurity;
        if (raw?.startsWith('blob:')) {
          URL.revokeObjectURL(raw);
        }
      }
      this.previewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
    } finally {
      this.previewLoading.set(false);
    }
  }

  async handlePrint(): Promise<void> {
    const vehicle = this.car();
    if (!vehicle || this.printing()) {
      return;
    }

    this.printing.set(true);
    try {
      await this.qrPrint.print(vehicle, this.labels(), this.language.language());
    } finally {
      this.printing.set(false);
    }
  }

  private labels(): CarQrPrintLabels {
    const t = (key: string) => this.translate.instant(key);
    return {
      cardTitle: t('cars.qr.card_title'),
      scanHint: t('cars.qr.scan_hint'),
      plate: t('table.plate_number'),
      vin: t('table.vin'),
      companyPhone: t('cars.qr.company_phone'),
      laserNote: t('cars.qr.laser_note'),
    };
  }
}
