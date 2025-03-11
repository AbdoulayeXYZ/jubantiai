import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  avatar?: string;
  bio?: string;
  specialization?: string; // Pour les enseignants
  grade?: string; // Pour les étudiants
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUserProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.API_URL}/${userId}/profile`);
  }

  updateUserProfile(userId: string, profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.API_URL}/${userId}/profile`, profile);
  }

  updatePassword(userId: string, data: { currentPassword: string; newPassword: string }): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${userId}/password`, data);
  }

  // Méthodes spécifiques aux enseignants
  getStudentsList(teacherId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/teacher/${teacherId}/students`);
  }

  // Méthodes spécifiques aux étudiants
  getTeachersList(studentId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/student/${studentId}/teachers`);
  }

  // Méthodes de recherche
  searchUsers(query: string, role?: 'student' | 'teacher'): Observable<User[]> {
    const params = role ? { query, role } : { query };
    return this.http.get<User[]>(`${this.API_URL}/search`, { params });
  }
}
