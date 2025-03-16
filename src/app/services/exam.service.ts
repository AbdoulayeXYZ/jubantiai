import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exam, CreateExamDto, UpdateExamDto } from '../models/exam.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = `${environment.apiUrl}/exams`;

  constructor(private http: HttpClient) { }

  // Get all exams for the logged-in teacher
  getTeacherExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.apiUrl}`);
  }

  // Get a specific exam by ID
  getExamById(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/${id}`);
  }

  // Create a new exam
  createExam(examData: FormData): Observable<Exam> {
    return this.http.post<Exam>(this.apiUrl, examData);
  }

  // Update an existing exam
  updateExam(id: number, examData: UpdateExamDto): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/${id}`, examData);
  }

  // Upload a correction template for an exam
  uploadCorrectionTemplate(id: number, file: File): Observable<Exam> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Exam>(`${this.apiUrl}/${id}/correction-template`, formData);
  }

  // Change the status of an exam
  changeExamStatus(id: number, status: 'draft' | 'published' | 'closed'): Observable<Exam> {
    return this.http.patch<Exam>(`${this.apiUrl}/${id}/status`, { status });
  }

  // Delete an exam
  deleteExam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get submission statistics for an exam
  getExamSubmissionStats(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/submission-stats`);
  }
}