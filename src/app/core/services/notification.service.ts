import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Notification {
  id: string;
  userId: string;
  type: 'exam_scheduled' | 'exam_reminder' | 'exam_graded' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  metadata?: {
    examId?: string;
    submissionId?: string;
    [key: string]: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly API_URL = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getNotifications(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.API_URL}/user/${userId}`);
  }

  getUnreadCount(userId: string): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/user/${userId}/unread/count`);
  }

  markAsRead(notificationId: string): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${notificationId}/read`, {});
  }

  markAllAsRead(userId: string): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/user/${userId}/read-all`, {});
  }

  deleteNotification(notificationId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${notificationId}`);
  }

  // Pour les notifications en temps réel (à utiliser avec WebSocket)
  subscribeToNotifications(userId: string): void {
    // TODO: Implémenter la logique WebSocket ici
    console.log('WebSocket subscription not implemented yet');
  }
}
