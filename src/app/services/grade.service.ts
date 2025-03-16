import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grade, CreateGradeDto, UpdateGradeDto, GradeSummary } from '../models/grade.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private apiUrl = `${environment.apiUrl}/grades`;

  constructor(private http: HttpClient) { }

  // Create a new grade
  createGrade(gradeData: CreateGradeDto): Observable<Grade> {
    return this.http.post<Grade>(this.apiUrl, gradeData);
  }

  // Get a specific grade by ID
  getGradeById(id: number): Observable<Grade> {
    return this.http.get<Grade>(`${this.apiUrl}/${id}`);
  }

  // Get grades for a specific submission
  getGradesBySubmission(submissionId: number): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/submission/${submissionId}`);
  }

  // Get grades for a specific exam
  getGradesByExam(examId: number): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/exam/${examId}`);
  }

  // Update a grade
  updateGrade(id: number, gradeData: UpdateGradeDto): Observable<Grade> {
    return this.http.put<Grade>(`${this.apiUrl}/${id}`, gradeData);
  }

  // Validate a grade
  validateGrade(id: number): Observable<Grade> {
    return this.http.patch<Grade>(`${this.apiUrl}/${id}/validate`, {});
  }
}