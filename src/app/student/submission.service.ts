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

  // Méthode pour obtenir les soumissions d'un étudiant
  getSubmissions(studentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/${studentId}`);
  }

  // Méthode pour obtenir une soumission par ID
  getSubmissionById(submissionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${submissionId}`);
  }
}
