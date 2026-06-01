import { Component, inject } from '@angular/core';
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
import { RecentOrdersComponent } from '@shared/ui/recent-orders/recent-orders.component';
import { StatCardComponent } from '@shared/ui/stat-card/stat-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule, StatCardComponent, RecentOrdersComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private readonly router = inject(Router);

  readonly Car = Car;
  readonly Clock = Clock;
  readonly CheckCircle = CheckCircle;
  readonly DollarSign = DollarSign;
  readonly Plus = Plus;
  readonly FileText = FileText;
  readonly QrCode = QrCode;
  readonly Receipt = Receipt;
  readonly ClipboardList = ClipboardList;

  navigateTo(path: string): void {
    void this.router.navigate([path]);
  }
}
