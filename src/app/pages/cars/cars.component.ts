import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Plus, Search, Eye, QrCode } from 'lucide-angular';
import { CarService } from '../../services/car.service';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule, ModalComponent],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.css'
})
export class CarsComponent implements OnInit {
  private carService = inject(CarService);

  readonly Plus = Plus;
  readonly Search = Search;
  readonly Eye = Eye;
  readonly QrCode = QrCode;

  cars = signal<any[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  isAddModalOpen = signal(false);
  selectedCar = signal<any>(null);
  formData = {
    plate_number: '',
    vin: '',
    car_model: '',
    color: '',
    odometer: '',
    owner_name: '',
  };
  errors = signal<any>({});
  currentPage = signal(1);
  totalPages = signal(1);

  ngOnInit() {
    this.fetchCars();
  }

  fetchCars() {
    this.loading.set(true);
    this.carService.getAll(this.currentPage()).subscribe({
      next: (response) => {
        this.cars.set(response.data);
        this.totalPages.set(response.meta.last_page);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to fetch cars', error);
        this.loading.set(false);
      }
    });
  }

  handleInputChange(name: string, value: string) {
    (this.formData as any)[name] = value;
    if (this.errors()[name]) {
      this.errors.update(errs => ({ ...errs, [name]: null }));
    }
  }

  handleSubmit() {
    this.errors.set({});
    this.carService.create(this.formData).subscribe({
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
      error: (error) => {
        if (error.error?.errors) {
          this.errors.set(error.error.errors);
        }
      }
    });
  }

  handleViewDetails(car: any) {
    this.selectedCar.set(car);
  }

  get filteredCars() {
    const term = this.searchTerm().toLowerCase();
    return this.cars().filter(car => 
      car.plate_number.toLowerCase().includes(term) ||
      car.owner_name.toLowerCase().includes(term) ||
      car.vin.toLowerCase().includes(term)
    );
  }
}
