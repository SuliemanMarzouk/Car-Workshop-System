import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SaaSAdminRepository } from '../data/saas-admin.repository';
import { CentralAdminUser } from '../models/saas-admin.models';

const CENTRAL_TOKEN_KEY = 'central_token';

@Injectable({ providedIn: 'root' })
export class CentralAuthService {
  private readonly repository = inject(SaaSAdminRepository);
  private readonly router = inject(Router);

  readonly user = signal<CentralAdminUser | null>(null);
  readonly token = signal<string | null>(localStorage.getItem(CENTRAL_TOKEN_KEY));
  readonly isAuthenticated = signal(!!localStorage.getItem(CENTRAL_TOKEN_KEY));

  private sessionReady: Promise<void> | null = null;

  async ensureSession(): Promise<boolean> {
    if (!this.token()) {
      return false;
    }

    if (this.user()) {
      return true;
    }

    if (!this.sessionReady) {
      this.sessionReady = this.refreshProfile().finally(() => {
        this.sessionReady = null;
      });
    }

    await this.sessionReady;

    return this.isAuthenticated() && !!this.user();
  }

  async login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await firstValueFrom(this.repository.login(email, password));
      localStorage.setItem(CENTRAL_TOKEN_KEY, response.access_token);
      this.token.set(response.access_token);
      this.user.set(response.user);
      this.isAuthenticated.set(true);
      return { success: true };
    } catch (error: unknown) {
      const body = (error as { error?: { message?: string } })?.error;
      return { success: false, message: body?.message ?? 'Login failed' };
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.repository.logout());
    } catch {
      // ignore
    } finally {
      this.clearSession();
      await this.router.navigate(['/platform/login']);
    }
  }

  private async refreshProfile(): Promise<void> {
    try {
      const user = await firstValueFrom(this.repository.getCurrentUser());
      this.user.set(user);
      this.isAuthenticated.set(true);
    } catch {
      this.clearSession();
    }
  }

  private clearSession(): void {
    localStorage.removeItem(CENTRAL_TOKEN_KEY);
    this.token.set(null);
    this.user.set(null);
    this.isAuthenticated.set(false);
  }
}
