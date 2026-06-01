import { UserRole } from '@core/auth/models/auth-session.model';

export interface TeamUser {
  id: number;
  name: string;
  email: string;
  role?: UserRole | null;
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface RoleOption {
  id: number;
  slug: string;
  name: string;
  name_ar: string;
  permissions: string[];
}

export interface CreateTeamUserPayload {
  name: string;
  email: string;
  password: string;
  role_id: number;
}

export interface UpdateTeamUserPayload {
  name: string;
  email: string;
  password?: string;
  role_id: number;
}
