import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ChatMessage, ChatHistory } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient) {}

  sendMessage(content: string, chatHistoryId?: number): Observable<ChatMessage> {
    const payload = {
      content,
      chatHistoryId
    };
    return this.http.post<ChatMessage>(`${this.apiUrl}/send`, payload);
  }

  getChatHistory(): Observable<ChatHistory[]> {
    return this.http.get<ChatHistory[]>(`${this.apiUrl}/history`);
  }

  createChatHistory(title?: string): Observable<ChatHistory> {
    return this.http.post<ChatHistory>(`${this.apiUrl}/history`, { title });
  }

  getChatHistoryById(id: number): Observable<ChatHistory> {
    return this.http.get<ChatHistory>(`${this.apiUrl}/history/${id}`);
  }

  updateChatHistory(id: number, data: Partial<ChatHistory>): Observable<ChatHistory> {
    return this.http.put<ChatHistory>(`${this.apiUrl}/history/${id}`, data);
  }

  deleteChatHistory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/history/${id}`);
  }

  streamChatResponse(content: string, chatHistoryId?: number): Observable<ChatMessage> {
    const payload = {
      content,
      chatHistoryId,
      stream: true
    };
    return this.http.post<ChatMessage>(`${this.apiUrl}/stream`, payload);
  }
}