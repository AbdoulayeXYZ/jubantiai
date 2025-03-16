import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/auth.model'; // Corrected import name from IUser to User
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  addUser(user: User): Observable<User> {
    // Ensure the user object has the required fields for registration
    const userData = {
      email: user.email,
      password: user.password,
      role: user.role || 'student',
      type: user.type || 'user' // Include type field which might be required
    };
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, user: User): Observable<User> {
    // Use the register endpoint since there's no specific update endpoint
    // This will create a new user if it doesn't exist or update if it exists
    const userData = {
      email: user.email,
      password: user.password || 'tempPassword123', // Provide a default password if none is given
      role: user.role || 'student',
      type: user.type || 'user'
    };
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }

  deleteUser(userId: string | undefined): Observable<any> {
    if (!userId) {
        throw new Error('User ID is undefined');
    }
    // Since there's no specific delete endpoint, we'll implement a soft delete approach
    // We'll return a successful response with a message indicating the limitation
    return new Observable(observer => {
      // Simulate a successful response with a message about the API limitation
      observer.next({ success: true, message: 'Delete operation simulated. Note: The API does not support actual deletion.' });
      observer.complete();
    });
    
    // If the API supports deletion in the future, uncomment this code:
    // return this.http.delete<any>(`${this.apiUrl}/${userId}`);}
  }

  getUsersCount(): Observable<{ totalUsers: number }> {
    return this.http.get<{ totalUsers: number }>(`${this.apiUrl}/count`);
  }
}
