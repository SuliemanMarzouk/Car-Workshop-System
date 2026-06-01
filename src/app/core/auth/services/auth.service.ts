import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiClient } from '@core/http/api-client.service';
import { AuthLoginResponse, AuthResult, AuthUser } from '@core/auth/models/auth-session.model';
import { normalizeAuthUser } from '@core/auth/utils/auth-user.mapper';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiClient);
  private readonly router = inject(Router);

  readonly user = signal<AuthUser | null>(null);
  readonly token = signal<string | null>(localStorage.getItem('token'));
  readonly isLoading = signal(true);
  readonly isAuthenticated = signal(!!localStorage.getItem('token'));

  private sessionReady: Promise<void> | null = null;
  private sessionGeneration = 0;

  constructor() {
    void this.checkAuth();
  }

  /** Load session from API; used by guards before permission checks. */
  async ensureSession(): Promise<boolean> {
    if (!this.token()) {
      this.isLoading.set(false);
      return false;
    }

    const user = this.user();
    if (user?.permissions && user.permissions.length > 0) {
      return true;
    }

    if (!this.sessionReady) {
      this.sessionReady = this.checkAuth().finally(() => {
        this.sessionReady = null;
      });
    }

    await this.sessionReady;

    return this.isAuthenticated() && (this.user()?.permissions?.length ?? 0) > 0;
  }

  /** Re-fetch profile from backend (source of truth for permissions). */
  async refreshSession(): Promise<void> {
    if (!this.token()) {
      return;
    }

    await this.fetchUserProfile();
  }

  async checkAuth(): Promise<void> {
    const generation = ++this.sessionGeneration;

    if (!this.token()) {
      this.isLoading.set(false);
      return;
    }

    await this.fetchUserProfile(generation);
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

  private async fetchUserProfile(expectedGeneration?: number): Promise<void> {
    try {
      const raw = await firstValueFrom(this.api.get<unknown>('/user'));
      const user = normalizeAuthUser(raw);

      if (expectedGeneration !== undefined && expectedGeneration !== this.sessionGeneration) {
        return;
      }

      if (user) {
        this.user.set(user);
        this.isAuthenticated.set(true);
      } else {
        this.clearSession();
      }
    } catch {
      if (expectedGeneration === undefined || expectedGeneration === this.sessionGeneration) {
        this.clearSession();
      }
    }
  }

  private persistSession(token: string, rawUser: unknown): void {
    this.sessionGeneration++;
    localStorage.setItem('token', token);
    this.token.set(token);

    const user = normalizeAuthUser(rawUser);
    this.user.set(user);
    this.isAuthenticated.set(!!user);
    this.isLoading.set(false);
  }

  private clearSession(): void {
    this.sessionGeneration++;
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
