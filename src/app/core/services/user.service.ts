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
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

    addUser(user: User): Observable<User> {
    return this.http.post<User>('http://localhost:3000/api/users/register', user);
  }
  getUserProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}/profile`);
  }

  updateUserProfile(userId: string, profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${userId}/profile`, profile);
  }

  updatePassword(userId: string, data: { currentPassword: string; newPassword: string }): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${userId}/password`, data);
  }

  // Méthodes spécifiques aux enseignants
  getStudentsList(teacherId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/teacher/${teacherId}/students`);
  }

  // Méthodes spécifiques aux étudiants
  getTeachersList(studentId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/student/${studentId}/teachers`);
  }

  // Méthodes de recherche
  searchUsers(query: string, role?: 'student' | 'teacher'): Observable<User[]> {
    const params = role ? { query, role } : { query };
    return this.http.get<User[]>(`${this.apiUrl}/search`, { params });
  }
}
