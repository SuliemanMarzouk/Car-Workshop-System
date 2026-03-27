import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LucideAngularModule, Car, Clock, CheckCircle, DollarSign, Plus, FileText, QrCode, Receipt } from 'lucide-angular';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { RecentOrdersComponent } from '../../components/recent-orders/recent-orders.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule, StatCardComponent, RecentOrdersComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private router = inject(Router);
  private translate = inject(TranslateService);

  readonly Car = Car;
  readonly Clock = Clock;
  readonly CheckCircle = CheckCircle;
  readonly DollarSign = DollarSign;
  readonly Plus = Plus;
  readonly FileText = FileText;
  readonly QrCode = QrCode;
  readonly Receipt = Receipt;

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
