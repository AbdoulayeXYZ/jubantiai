import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private apiUrl = 'http://localhost:3000/api/submissions'; // URL de l'API

  constructor(private http: HttpClient) { }

  // Méthode pour soumettre un examen
  submitExam(submissionData: any): Observable<any> {
    return this.http.post(this.apiUrl, submissionData);
  }

  // Méthode pour obtenir les sujets d'examen
  getExamSubjects(): Observable<any> {
    return this.http.get('http://localhost:3000/api/exam-subjects');
  }

  getSubmissions(studentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/${studentId}`);
  }

  // Méthode pour obtenir les soumissions par date
  getSubmissionsByDate(studentId: number, date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/${studentId}/date/${date}`);
  }

  // Méthode pour obtenir les soumissions par statut
  getSubmissionsByStatus(studentId: number, status: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/${studentId}/status/${status}`);
  }

  // Méthode pour obtenir une soumission par ID

  getSubmissionById(submissionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${submissionId}`);
  }
}
