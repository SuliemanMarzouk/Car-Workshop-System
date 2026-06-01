import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  Car,
  CheckCircle,
  ClipboardList,
  Clock,
  DollarSign,
  FileText,
  LucideAngularModule,
  Plus,
  QrCode,
  Receipt,
} from 'lucide-angular';
import { DashboardRepository } from '@features/dashboard/data/dashboard.repository';
import { RecentOrdersComponent } from '@shared/ui/recent-orders/recent-orders.component';
import { StatCardComponent } from '@shared/ui/stat-card/stat-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule, StatCardComponent, RecentOrdersComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly dashboardRepository = inject(DashboardRepository);

  readonly Car = Car;
  readonly Clock = Clock;
  readonly CheckCircle = CheckCircle;
  readonly DollarSign = DollarSign;
  readonly Plus = Plus;
  readonly FileText = FileText;
  readonly QrCode = QrCode;
  readonly Receipt = Receipt;
  readonly ClipboardList = ClipboardList;

  readonly loading = signal(true);
  readonly totalCars = signal('0');
  readonly pendingOrders = signal('0');
  readonly approvedOrders = signal('0');
  readonly invoicesToday = signal('0');

  ngOnInit(): void {
    this.dashboardRepository.getStats().subscribe({
      next: (stats) => {
        this.totalCars.set(String(stats.total_cars));
        this.pendingOrders.set(String(stats.pending_work_orders));
        this.approvedOrders.set(String(stats.approved_work_orders));
        this.invoicesToday.set(Number(stats.invoices_total_today).toFixed(2));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  navigateTo(path: string): void {
    void this.router.navigate([path]);
  }

  printQrPlaceholder(): void {
    void this.router.navigate(['/cars']);
  }
}
