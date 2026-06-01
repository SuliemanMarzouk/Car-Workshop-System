import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Mail, Shield, User } from 'lucide-angular';

interface UserListItem {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule],
  templateUrl: './user-list.component.html',
})
export class UserListComponent {
  readonly User = User;
  readonly Shield = Shield;
  readonly Mail = Mail;

  readonly users: UserListItem[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'Staff', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Mechanic', status: 'active' },
  ];
}
