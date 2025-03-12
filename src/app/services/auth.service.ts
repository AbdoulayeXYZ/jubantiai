import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthResponse, RegisterData, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly JWT = 'token';
  private readonly USER = 'user';
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        this.storeJwtToken(response.token);
        this.setCurrentUser({...response.user, type: response.user.role});
      })
    );
  }

  register(userData: RegisterData) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap((response: AuthResponse) => {
        this.storeJwtToken(response.token);
        this.setCurrentUser({...response.user, type: response.user.role});
      })
    );
  }

  private storeJwtToken(token: string) {
    localStorage.setItem(this.JWT, token);
  }

  private setCurrentUser(user: User) {
    localStorage.setItem(this.USER, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(this.JWT);
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.JWT);
    localStorage.removeItem(this.USER);
    this.router.navigate(['/auth/login']);
  }
}

