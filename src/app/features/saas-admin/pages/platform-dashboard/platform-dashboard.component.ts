import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SaaSAdminStateService } from '../../services/saas-admin-state.service';

@Component({
  selector: 'app-platform-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './platform-dashboard.component.html',
  styleUrl: '../../styles/platform-content.scss',
})
export class PlatformDashboardComponent implements OnInit {
  readonly state = inject(SaaSAdminStateService);

  ngOnInit(): void {
    void this.state.loadStats();
  }
}
