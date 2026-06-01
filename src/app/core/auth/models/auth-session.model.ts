export interface AuthUser {
  id: number;
  name: string;
  email: string;
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
