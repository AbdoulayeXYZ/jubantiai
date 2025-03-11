import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../models/auth.model';
import { Router } from '@angular/router';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API_URL}/login`, credentials).pipe(
      map(response => response.data),
      tap(data => this.handleAuthSuccess(data))
    );
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API_URL}/register`, data).pipe(
      map(response => response.data),
      tap(data => this.handleAuthSuccess(data))
    );
  }

  logout(): void {
    console.log('Logout initiated');
    console.log('Current token before logout:', this.getToken());
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    console.log('Logout completed - Token after removal:', this.getToken());
    this.router.navigate(['/auth/login']);
  }

  private handleAuthSuccess(response: AuthResponse): void {
    if (!response || !response.user || !response.token) {
      console.error('Invalid auth response:', response);
      return;
    }

    console.log('Auth success - Starting token storage process');
    
    // Store token without Bearer prefix
    const token = response.token.replace('Bearer ', '');
    console.log('Token before storage:', token);
    
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      console.log('Token and user stored successfully');
      
      // Vérifier que le stockage a réussi
      const storedToken = localStorage.getItem(this.TOKEN_KEY);
      const storedUser = localStorage.getItem(this.USER_KEY);
      console.log('Verification after storage - Token:', storedToken);
      console.log('Verification after storage - User:', storedUser);
      
      if (!storedToken || !storedUser) {
        console.error('Storage verification failed');
        this.logout();
        return;
      }
      
      this.currentUserSubject.next(response.user);
      console.log('Current user subject updated');
      
      // Attendre que le token soit bien stocké avant de rediriger
      setTimeout(() => {
        const role = response.user.role;
        console.log('Navigation - User role:', role);
        console.log('Navigation - Current token:', this.getToken());
        
        if (role === 'student') {
          this.router.navigate(['/student/dashboard']);
        } else if (role === 'teacher') {
          this.router.navigate(['/teacher/dashboard']);
        } else {
          console.error('Invalid user role:', role);
          this.logout();
        }
      }, 100);
    } catch (error) {
      console.error('Error during auth success handling:', error);
      this.logout();
    }
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    console.log('Getting token from storage:', token);
    return token;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    console.log('Checking authentication - Token:', token, 'User:', user);
    return !!(token && user);
  }

  isTeacher(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'teacher';
  }

  isStudent(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'student';
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }
} 