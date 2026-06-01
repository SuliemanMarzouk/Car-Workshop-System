export interface UserRole {
  id: number;
  slug: string;
  name: string;
  name_ar: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role?: UserRole | null;
  permissions?: string[];
}

export interface AuthLoginResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}
