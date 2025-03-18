import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<Submission[]>(url);
  }

  // Get a specific submission by ID with details
  getSubmissionById(id: number): Observable<SubmissionWithDetails> {
    return this.http.get<SubmissionWithDetails>(`${this.apiUrl}/${id}`);
  }

  // Get submissions for a specific exam
  getSubmissionsByExam(examId: number): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${environment.apiUrl}/exams/${examId}/submissions`);
  }

  // Update a submission
  updateSubmission(id: number, data: Partial<Submission>): Observable<Submission> {
    return this.http.put<Submission>(`${this.apiUrl}/${id}`, data);
  }

  // Download a submission file
  downloadSubmission(submissionId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${submissionId}/download`, {
      responseType: 'blob'
    });
  }
}
