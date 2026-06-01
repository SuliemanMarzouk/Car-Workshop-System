import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Eye, Filter, Plus, Search, Trash2 } from 'lucide-angular';
import { CarRepository } from '@features/cars/data/car.repository';
import { Car } from '@features/cars/models/car.model';
import { WorkOrderRepository } from '@features/work-orders/data/work-order.repository';
import { CreateWorkOrderPayload, WorkOrder } from '@features/work-orders/models/work-order.model';
import { ModalComponent } from '@shared/ui/modal/modal.component';

@Component({
  selector: 'app-work-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule, ModalComponent],
  templateUrl: './work-order-list.component.html',
})
export class WorkOrderListComponent implements OnInit {
  private readonly workOrderRepository = inject(WorkOrderRepository);
  private readonly carRepository = inject(CarRepository);

  readonly Plus = Plus;
  readonly Search = Search;
  readonly Eye = Eye;
  readonly Filter = Filter;
  readonly Trash2 = Trash2;

  readonly workOrders = signal<WorkOrder[]>([]);
  readonly cars = signal<Car[]>([]);
  readonly loading = signal(true);
  readonly searchTerm = signal('');
  readonly isAddModalOpen = signal(false);
  readonly selectedOrder = signal<WorkOrder | null>(null);
  readonly errors = signal<Record<string, string[]>>({});
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);

  formData: CreateWorkOrderPayload = {
    car_id: '',
    items: [{ description: '', price: '' }],
  };

  ngOnInit(): void {
    this.fetchWorkOrders();
    this.fetchCars();
  }

  fetchWorkOrders(): void {
    this.loading.set(true);
    this.workOrderRepository.list(this.currentPage()).subscribe({
      next: (response) => {
        this.workOrders.set(response.data);
        this.totalPages.set(response.meta.last_page);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  fetchCars(): void {
    this.carRepository.list(1).subscribe({
      next: (response) => this.cars.set(response.data),
    });
  }

  handleItemChange(index: number, name: 'description' | 'price', value: string): void {
    const items = [...this.formData.items];
    items[index] = { ...items[index], [name]: value };
    this.formData = { ...this.formData, items };
  }

  addItem(): void {
    this.formData = {
      ...this.formData,
      items: [...this.formData.items, { description: '', price: '' }],
    };
  }

  removeItem(index: number): void {
    this.formData = {
      ...this.formData,
      items: this.formData.items.filter((_, itemIndex) => itemIndex !== index),
    };
  }

  handleSubmit(): void {
    this.errors.set({});
    this.workOrderRepository.create(this.formData).subscribe({
      next: () => {
        this.isAddModalOpen.set(false);
        this.formData = { car_id: '', items: [{ description: '', price: '' }] };
        this.fetchWorkOrders();
      },
      error: (error: { error?: { errors?: Record<string, string[]> } }) => {
        if (error.error?.errors) {
          this.errors.set(error.error.errors);
        }
      },
    });
  }

  handleViewDetails(order: WorkOrder): void {
    this.selectedOrder.set(order);
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'badge-pending';
      case 'approved':
        return 'badge-approved';
      case 'rejected':
        return 'badge-rejected';
      case 'completed':
        return 'badge-completed';
      default:
        return 'badge-pending';
    }
  }

  get filteredOrders(): WorkOrder[] {
    const term = this.searchTerm().toLowerCase();
    return this.workOrders().filter(
      (order) =>
        order.id.toString().includes(term) ||
        order.car?.plate_number.toLowerCase().includes(term) ||
        order.car?.owner_name.toLowerCase().includes(term),
    );
  }
}
