import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/api';
  
  user = signal<any>(null);
  token = signal<string | null>(localStorage.getItem('token'));
  isLoading = signal<boolean>(true);
  isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuth();
  }

  async checkAuth() {
    const currentToken = this.token();
    if (currentToken) {
      try {
        const user = await firstValueFrom(this.http.get(`${this.baseUrl}/user`, {
          headers: { 'Authorization': `Bearer ${currentToken}` }
        }));
        this.user.set(user);
        this.isAuthenticated.set(true);
      } catch (error) {
        console.error('Failed to fetch user', error);
        this.logout();
      }
    }
    this.isLoading.set(false);
  }

  async login(email: string, password: string) {
    try {
      const response: any = await firstValueFrom(this.http.post(`${this.baseUrl}/login`, { email, password }));
      const { access_token, user } = response;
      
      localStorage.setItem('token', access_token);
      this.token.set(access_token);
      this.user.set(user);
      this.isAuthenticated.set(true);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.error?.message || 'Login failed' 
      };
    }
  }

  async register(userData: any) {
    try {
      const response: any = await firstValueFrom(this.http.post(`${this.baseUrl}/register`, userData));
      const { access_token, user } = response;
      
      localStorage.setItem('token', access_token);
      this.token.set(access_token);
      this.user.set(user);
      this.isAuthenticated.set(true);
      return { success: true };
    } catch (error: any) {
       const message = error.error?.message || 'Registration failed';
       const errors = error.error?.errors;
       return { success: false, message, errors };
    }
  }

  async logout() {
    try {
      await firstValueFrom(this.http.post(`${this.baseUrl}/logout`, {}, {
        headers: { 'Authorization': `Bearer ${this.token()}` }
      }));
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('token');
      this.token.set(null);
      this.user.set(null);
      this.isAuthenticated.set(false);
      this.router.navigate(['/login']);
    }
  }

  async forgotPassword(email: string) {
    try {
      const response: any = await firstValueFrom(this.http.post(`${this.baseUrl}/forgot-password`, { email }));
      return { success: true, message: response.status };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.error?.message || 'Failed to send reset link',
        errors: error.error?.errors 
      };
    }
  }

  async resetPassword(data: any) {
    try {
      const response: any = await firstValueFrom(this.http.post(`${this.baseUrl}/reset-password`, data));
      return { success: true, message: response.status };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.error?.message || 'Failed to reset password',
        errors: error.error?.errors 
      };
    }
  }
}
