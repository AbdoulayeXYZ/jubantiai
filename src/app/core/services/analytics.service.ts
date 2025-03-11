import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TeacherAnalytics {
  totalExams: number;
  totalStudents: number;
  examsByStatus: {
    draft: number;
    published: number;
    in_progress: number;
    completed: number;
  };
  averageScores: {
    examId: string;
    examTitle: string;
    averageScore: number;
  }[];
  studentPerformance: {
    studentId: string;
    studentName: string;
    averageScore: number;
    examsCompleted: number;
  }[];
}

export interface StudentAnalytics {
  totalExamsTaken: number;
  averageScore: number;
  examScores: {
    examId: string;
    examTitle: string;
    score: number;
    date: Date;
  }[];
  performanceBySubject: {
    subject: string;
    averageScore: number;
    examsTaken: number;
  }[];
  upcomingExams: {
    examId: string;
    examTitle: string;
    date: Date;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly API_URL = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  // Méthodes pour les enseignants
  getTeacherAnalytics(teacherId: string): Observable<TeacherAnalytics> {
    return this.http.get<TeacherAnalytics>(`${this.API_URL}/teacher/${teacherId}`);
  }

  getExamAnalytics(examId: string): Observable<{
    participationRate: number;
    averageScore: number;
    scoreDistribution: { range: string; count: number }[];
    timeSpentDistribution: { range: string; count: number }[];
    questionAnalysis: {
      questionId: string;
      correctAnswers: number;
      totalAttempts: number;
      averageTimeSpent: number;
    }[];
  }> {
    return this.http.get<any>(`${this.API_URL}/exam/${examId}`);
  }

  // Méthodes pour les étudiants
  getStudentAnalytics(studentId: string): Observable<StudentAnalytics> {
    return this.http.get<StudentAnalytics>(`${this.API_URL}/student/${studentId}`);
  }

  getStudentProgressOverTime(studentId: string): Observable<{
    timeline: {
      date: Date;
      score: number;
      examId: string;
      examTitle: string;
    }[];
    trend: 'improving' | 'declining' | 'stable';
  }> {
    return this.http.get<any>(`${this.API_URL}/student/${studentId}/progress`);
  }

  // Méthodes communes
  getComparativeAnalysis(examId: string, userId: string): Observable<{
    userScore: number;
    classAverage: number;
    percentile: number;
    ranking: number;
    totalParticipants: number;
  }> {
    return this.http.get<any>(`${this.API_URL}/exam/${examId}/compare/${userId}`);
  }
} 