import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'https://api.example.com/chatbot'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { message });
  }

  getResponse(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
