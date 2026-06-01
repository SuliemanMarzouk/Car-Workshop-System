import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Eye, Plus, QrCode, Search } from 'lucide-angular';
import { CarRepository } from '@features/cars/data/car.repository';
import { Car, CreateCarPayload } from '@features/cars/models/car.model';
import { CarQrPrintModalComponent } from '@features/cars/ui/car-qr-print-modal/car-qr-print-modal.component';
import { ModalComponent } from '@shared/ui/modal/modal.component';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    LucideAngularModule,
    ModalComponent,
    CarQrPrintModalComponent,
  ],
  templateUrl: './car-list.component.html',
})
export class CarListComponent implements OnInit {
  private readonly carRepository = inject(CarRepository);
  private readonly route = inject(ActivatedRoute);

  readonly Plus = Plus;
  readonly Search = Search;
  readonly Eye = Eye;
  readonly QrCode = QrCode;

  readonly cars = signal<Car[]>([]);
  readonly loading = signal(true);
  readonly searchTerm = signal('');
  readonly isAddModalOpen = signal(false);
  readonly selectedCar = signal<Car | null>(null);
  readonly qrPrintCar = signal<Car | null>(null);
  readonly errors = signal<Record<string, string[]>>({});
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);

  formData: CreateCarPayload = {
    plate_number: '',
    vin: '',
    car_model: '',
    color: '',
    odometer: '',
    owner_name: '',
  };

  ngOnInit(): void {
    this.fetchCars();
    this.route.queryParamMap.subscribe((params) => {
      const vehicleId = params.get('vehicle');
      if (!vehicleId) {
        return;
      }
      const id = Number(vehicleId);
      if (!Number.isFinite(id)) {
        return;
      }
      this.openQrWhenCarLoaded(id);
    });
  }

  fetchCars(): void {
    this.loading.set(true);
    this.carRepository.list(this.currentPage()).subscribe({
      next: (response) => {
        this.cars.set(response.data);
        this.totalPages.set(response.meta.last_page);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  handleInputChange(name: keyof CreateCarPayload, value: string): void {
    this.formData = { ...this.formData, [name]: value };
    if (this.errors()[name]) {
      this.errors.update((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }
  }

  handleSubmit(): void {
    this.errors.set({});
    const payload = {
      ...this.formData,
      odometer: Number(this.formData.odometer) || 0,
    };
    this.carRepository.create(payload).subscribe({
      next: () => {
        this.isAddModalOpen.set(false);
        this.formData = {
          plate_number: '',
          vin: '',
          car_model: '',
          color: '',
          odometer: '',
          owner_name: '',
        };
        this.fetchCars();
      },
      error: (error: { error?: { errors?: Record<string, string[]> } }) => {
        if (error.error?.errors) {
          this.errors.set(error.error.errors);
        }
      },
    });
  }

  handleViewDetails(car: Car): void {
    this.selectedCar.set(car);
  }

  closeDetails(): void {
    this.selectedCar.set(null);
  }

  openQrPrint(car: Car): void {
    this.qrPrintCar.set(car);
  }

  closeQrPrint(): void {
    this.qrPrintCar.set(null);
  }

  private openQrWhenCarLoaded(id: number): void {
    const existing = this.cars().find((c) => c.id === id);
    if (existing) {
      this.qrPrintCar.set(existing);
      return;
    }
    this.carRepository.getById(id).subscribe({
      next: (car) => this.qrPrintCar.set(car),
      error: () => undefined,
    });
  }

  get filteredCars(): Car[] {
    const term = this.searchTerm().toLowerCase();
    return this.cars().filter(
      (car) =>
        car.plate_number.toLowerCase().includes(term) ||
        car.owner_name.toLowerCase().includes(term) ||
        car.vin.toLowerCase().includes(term),
    );
  }
}
