import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Submission, SubmissionFilters, SubmissionWithDetails } from '../models/submission.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private apiUrl = `${environment.apiUrl}/submissions`;

  constructor(private http: HttpClient) { }




  // Get all submissions with optional filters
  getSubmissions(filters?: SubmissionFilters): Observable<Submission[]> {
    let url = this.apiUrl;
    if (filters) {
      const queryParams = [];
      if (filters.examId) queryParams.push(`examId=${filters.examId}`);
      if (filters.studentId) queryParams.push(`studentId=${filters.studentId}`);
      if (filters.status) queryParams.push(`status=${filters.status}`);
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }
    }    
    console.log('API Request URL:', url);
    return this.http.get<Submission[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Get a specific submission by ID with details
  getSubmissionById(id: number): Observable<SubmissionWithDetails> {
    return this.http.get<SubmissionWithDetails>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get submissions for a specific exam
  getSubmissionsByExam(examId: number): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${environment.apiUrl}/exams/${examId}/submissions`).pipe(
      catchError(this.handleError)
    );
  }

  // Update a submission
  updateSubmission(id: number, data: Partial<Submission>): Observable<Submission> {
    return this.http.put<Submission>(`${this.apiUrl}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Download a submission file
  downloadSubmission(submissionId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${submissionId}/download`, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    
    if (error.status === 0) {
      // A client-side or network error occurred
      errorMessage = 'Erreur de connexion au serveur. Veuillez vérifier que le serveur backend est en cours d\'exécution.';
      console.error('Une erreur de connexion est survenue:', error.error);
    } else {
      // The backend returned an unsuccessful response code
      errorMessage = `Le serveur a retourné le code ${error.status}: ${error.error.message || error.statusText}`;
      console.error(`Erreur backend:`, error.error);
    }
    
    // Return an observable with a user-facing error message
    return throwError(() => new Error(errorMessage));
  }
}
