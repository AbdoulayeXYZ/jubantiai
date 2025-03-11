import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:3000/api/exams'; // Update with your actual API endpoint

  constructor(private http: HttpClient) {}

  getExams(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
