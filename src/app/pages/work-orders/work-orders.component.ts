import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Plus, Search, Eye, Filter, Trash2 } from 'lucide-angular';
import { WorkOrderService } from '../../services/work-order.service';
import { CarService } from '../../services/car.service';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-work-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LucideAngularModule, ModalComponent],
  templateUrl: './work-orders.component.html',
  styleUrl: './work-orders.component.css'
})
export class WorkOrdersComponent implements OnInit {
  private workOrderService = inject(WorkOrderService);
  private carService = inject(CarService);

  readonly Plus = Plus;
  readonly Search = Search;
  readonly Eye = Eye;
  readonly Filter = Filter;
  readonly Trash2 = Trash2;

  workOrders = signal<any[]>([]);
  cars = signal<any[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  isAddModalOpen = signal(false);
  selectedOrder = signal<any>(null);
  formData = {
    car_id: '',
    items: [{ description: '', price: '' }],
  };
  errors = signal<any>({});
  currentPage = signal(1);
  totalPages = signal(1);

  ngOnInit() {
    this.fetchWorkOrders();
    this.fetchCars();
  }

  fetchWorkOrders() {
    this.loading.set(true);
    this.workOrderService.getAll(this.currentPage()).subscribe({
      next: (response) => {
        this.workOrders.set(response.data);
        this.totalPages.set(response.meta.last_page);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to fetch work orders', error);
        this.loading.set(false);
      }
    });
  }

  fetchCars() {
    this.carService.getAll(1).subscribe({
      next: (response) => {
        this.cars.set(response.data);
      },
      error: (error) => {
        console.error('Failed to fetch cars', error);
      }
    });
  }

  handleItemChange(index: number, name: string, value: string) {
    const newItems = [...this.formData.items];
    (newItems[index] as any)[name] = value;
    this.formData.items = newItems;
  }

  addItem() {
    this.formData.items.push({ description: '', price: '' });
  }

  removeItem(index: number) {
    this.formData.items = this.formData.items.filter((_, i) => i !== index);
  }

  handleSubmit() {
    this.errors.set({});
    this.workOrderService.create(this.formData).subscribe({
      next: () => {
        this.isAddModalOpen.set(false);
        this.formData = {
          car_id: '',
          items: [{ description: '', price: '' }],
        };
        this.fetchWorkOrders();
      },
      error: (error) => {
        if (error.error?.errors) {
          this.errors.set(error.error.errors);
        }
      }
    });
  }

  handleViewDetails(order: any) {
    this.selectedOrder.set(order);
  }

  getStatusStyle(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  get filteredOrders() {
    const term = this.searchTerm().toLowerCase();
    return this.workOrders().filter(order => 
      order.id.toString().includes(term) ||
      order.car?.plate_number.toLowerCase().includes(term) ||
      order.car?.owner_name.toLowerCase().includes(term)
    );
  }
}
