import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, User, Shield, Mail } from 'lucide-angular';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  readonly User = User;
  readonly Shield = Shield;
  readonly Mail = Mail;

  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'Staff', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Mechanic', status: 'active' },
  ];
}
