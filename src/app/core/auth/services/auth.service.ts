import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiClient } from '@core/http/api-client.service';
import { AuthLoginResponse, AuthResult, AuthUser } from '@core/auth/models/auth-session.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiClient);
  private readonly router = inject(Router);

  readonly user = signal<AuthUser | null>(null);
  readonly token = signal<string | null>(localStorage.getItem('token'));
  readonly isLoading = signal(true);
  readonly isAuthenticated = signal(!!localStorage.getItem('token'));

  constructor() {
    void this.checkAuth();
  }

  async checkAuth(): Promise<void> {
    const currentToken = this.token();

    if (currentToken) {
      try {
        const user = await firstValueFrom(this.api.get<AuthUser>('/user'));
        this.user.set(user);
        this.isAuthenticated.set(true);
      } catch {
        this.clearSession();
      }
    }

    this.isLoading.set(false);
  }

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const response = await firstValueFrom(
        this.api.post<AuthLoginResponse>('/login', { email, password }),
      );
      this.persistSession(response.access_token, response.user);
      return { success: true };
    } catch (error: unknown) {
      return this.toErrorResult(error, 'Login failed');
    }
  }

  async register(userData: Record<string, string>): Promise<AuthResult> {
    try {
      const response = await firstValueFrom(
        this.api.post<AuthLoginResponse>('/register', userData),
      );
      this.persistSession(response.access_token, response.user);
      return { success: true };
    } catch (error: unknown) {
      return this.toErrorResult(error, 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.api.post('/logout', {}));
    } catch {
      // ignore network errors on logout
    } finally {
      this.clearSession();
      await this.router.navigate(['/login']);
    }
  }

  async forgotPassword(email: string): Promise<AuthResult> {
    try {
      const response = await firstValueFrom(
        this.api.post<{ status: string }>('/forgot-password', { email }),
      );
      return { success: true, message: response.status };
    } catch (error: unknown) {
      return this.toErrorResult(error, 'Failed to send reset link');
    }
  }

  async resetPassword(data: Record<string, string>): Promise<AuthResult> {
    try {
      const response = await firstValueFrom(
        this.api.post<{ status: string }>('/reset-password', data),
      );
      return { success: true, message: response.status };
    } catch (error: unknown) {
      return this.toErrorResult(error, 'Failed to reset password');
    }
  }

  private persistSession(token: string, user: AuthUser): void {
    localStorage.setItem('token', token);
    this.token.set(token);
    this.user.set(user);
    this.isAuthenticated.set(true);
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    this.token.set(null);
    this.user.set(null);
    this.isAuthenticated.set(false);
  }

  private toErrorResult(error: unknown, fallback: string): AuthResult {
    const body = (error as { error?: { message?: string; errors?: Record<string, string[]> } })?.error;

    return {
      success: false,
      message: body?.message ?? fallback,
      errors: body?.errors,
    };
  }
}
