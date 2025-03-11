import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface IExam {
  id?: number;
  title: string;
  description?: string;
  subjectPath: string;
  correctionTemplatePath?: string;
  status: 'draft' | 'published' | 'closed';
  deadline?: Date;
  teacherId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateExamDto {
  title: string;
  description?: string;
  status?: 'draft' | 'published' | 'closed';
  deadline?: Date;
}

export interface Question {
  id?: string;
  text: string;
  type: 'multiple_choice' | 'text' | 'true_false';
  options?: string[];
  correctAnswer: string | boolean;
  points: number;
}

export interface Exam {
  id?: string;
  title: string;
  description: string;
  duration: number; // en minutes
  startDate: Date;
  endDate: Date;
  teacherId: string;
  questions: Question[];
  status: 'draft' | 'published' | 'in_progress' | 'completed';
  totalPoints?: number;
}

export interface ExamSubmission {
  id?: string;
  examId: string;
  studentId: string;
  answers: {
    questionId: string;
    answer: string | boolean;
  }[];
  submittedAt: Date;
  score?: number;
  status: 'in_progress' | 'submitted' | 'graded';
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private readonly API_URL = `${environment.apiUrl}/exams`;

  constructor(private http: HttpClient) {}

  getExams(): Observable<IExam[]> {
    return this.http.get<IExam[]>(this.API_URL);
  }

  createExam(examData: ICreateExamDto, subjectFile: File): Observable<IExam> {
    const formData = new FormData();
    formData.append('title', examData.title);
    formData.append('description', examData.description || '');
    formData.append('status', examData.status || 'draft');
    if (examData.deadline) {
      formData.append('deadline', examData.deadline.toISOString());
    }
    formData.append('file', subjectFile);
    return this.http.post<IExam>(this.API_URL, formData);
  }

  getExamsByTeacher(teacherId: number): Observable<IExam[]> {
    return this.http.get<IExam[]>(`${this.API_URL}`);
  }

  getExamById(examId: number): Observable<IExam> {
    return this.http.get<IExam>(`${this.API_URL}/${examId}`);
  }

  updateExam(examId: number, examData: Partial<IExam>): Observable<IExam> {
    return this.http.patch<IExam>(`${this.API_URL}/${examId}`, examData);
  }

  updateExamStatus(examId: number, status: 'draft' | 'published' | 'closed'): Observable<IExam> {
    return this.http.patch<IExam>(`${this.API_URL}/${examId}`, { status });
  }

  deleteExam(examId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${examId}`);
  }

  // Méthodes pour les étudiants
  getAvailableExams(studentId: string): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.API_URL}/available/${studentId}`);
  }

  submitExam(submission: Omit<ExamSubmission, 'id'>): Observable<ExamSubmission> {
    return this.http.post<ExamSubmission>(`${this.API_URL}/submit`, submission);
  }

  // Méthodes communes
  getExamResults(examId: string, studentId: string): Observable<ExamSubmission> {
    return this.http.get<ExamSubmission>(`${this.API_URL}/${examId}/results/${studentId}`);
  }

  getExamStatistics(examId: string): Observable<{
    totalSubmissions: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    submissionsByScore: { score: number; count: number }[];
  }> {
    return this.http.get<any>(`${this.API_URL}/${examId}/statistics`);
  }
}
