import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { SubmissionService } from '../../../services/submission.service';
import { GradeService } from '../../../services/grade.service';
import { AuthService } from '../../../services/auth.service';
import { Submission, SubmissionWithDetails, SubmissionFilters } from '../../../models/submission.model';
import { Grade, GradeSummary } from '../../../models/grade.model';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-performances',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './performances.component.html',
  styleUrls: ['./performances.component.css']
})
export class PerformancesComponent implements OnInit {
  // Data properties
  submissions: Submission[] = [];
  grades: Grade[] = [];
  loading = true;
  error = '';
  selectedExamId: number | null = null;
  
  // Performance metrics
  averageScore = 0;
  totalSubmissions = 0;
  gradedSubmissions = 0;
  pendingSubmissions = 0;
  
  // Chart configurations
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 0,
        max: 100
      }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };
  
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie'> = {
    labels: ['Excellent (90-100)', 'Good (80-89)', 'Average (70-79)', 'Below Average (60-69)', 'Poor (<60)'],
    datasets: [{ data: [0, 0, 0, 0, 0] }]
  };
  
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      x: {},
      y: {
        position: 'left',
        min: 0,
        max: 100
      }
    },
    plugins: {
      legend: { display: true }
    }
  };
  
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  constructor(
    private submissionService: SubmissionService,
    private gradeService: GradeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStudentSubmissions();
  }

  loadStudentSubmissions(): void {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.error = 'Utilisateur non authentifié';
      this.loading = false;
      return;
    }
    
    const filters: SubmissionFilters = {
      studentId: currentUser.id
    };
    
    this.submissionService.getSubmissions(filters).subscribe({
      next: (data) => {
        this.submissions = data;
        this.loadGrades();
      },
      error: (err) => {
        this.error = err.message || 'Échec du chargement des soumissions. Veuillez vérifier que le serveur backend est en cours d\'exécution.';
        this.loading = false;
        console.error('Erreur lors du chargement des soumissions:', err);
      }
    });
  }

  loadGrades(): void {
    // Ensure submissions is an array
    if (!Array.isArray(this.submissions)) {
      console.error('Submissions is not an array:', this.submissions);
      this.submissions = Array.isArray(this.submissions) ? this.submissions : [this.submissions].filter(Boolean);
    }
    
    if (!this.submissions || this.submissions.length === 0) {
      this.loading = false;
      return;
    }

    // Get all grades for all submissions
    const submissionIds = this.submissions.map(s => s.id);
    const gradeRequests = submissionIds.map(id => 
      this.gradeService.getGradesBySubmission(id)
    );

    // Process all grades
    let allGrades: Grade[] = [];
    let completedRequests = 0;

    gradeRequests.forEach((request, index) => {
      request.subscribe({
        next: (grades) => {
          allGrades = [...allGrades, ...grades];
          completedRequests++;
          
          if (completedRequests === submissionIds.length) {
            this.grades = allGrades;
            this.calculatePerformanceMetrics();
            this.prepareChartData();
            this.loading = false;
          }
        },
        error: (err) => {
          console.error(`Failed to load grades for submission ${submissionIds[index]}`, err);
          completedRequests++;
          
          if (completedRequests === submissionIds.length) {
            this.loading = false;
          }
        }
      });
    });
  }

  calculatePerformanceMetrics(): void {
    if (this.grades.length === 0) return;

    // Calculate average score
    const totalScore = this.grades.reduce((sum, grade) => sum + grade.score, 0);
    this.averageScore = totalScore / this.grades.length;

    // Count submissions by status
    this.totalSubmissions = this.submissions.length;
    this.gradedSubmissions = this.submissions.filter(s => s.status === 'graded').length;
    this.pendingSubmissions = this.totalSubmissions - this.gradedSubmissions;
  }

  prepareChartData(): void {
    if (this.submissions.length === 0 || this.grades.length === 0) return;

    // Prepare data for bar chart (scores by exam)
    const examMap = new Map<number, { name: string, scores: number[] }>();
    
    this.submissions.forEach(submission => {
      if (submission.exam) {
        const examId = submission.examId;
        const examName = submission.exam.title || `Exam ${examId}`;
        
        if (!examMap.has(examId)) {
          examMap.set(examId, { name: examName, scores: [] });
        }
        
        const submissionGrades = this.grades.filter(g => g.submissionId === submission.id);
        if (submissionGrades.length > 0) {
          const avgScore = submissionGrades.reduce((sum, g) => sum + g.score, 0) / submissionGrades.length;
          examMap.get(examId)?.scores.push(avgScore);
        }
      }
    });
    
    // Update bar chart data
    this.barChartData.labels = Array.from(examMap.values()).map(exam => exam.name);
    this.barChartData.datasets = [{
      data: Array.from(examMap.values()).map(exam => {
        const avgExamScore = exam.scores.length > 0 ? 
          exam.scores.reduce((sum, score) => sum + score, 0) / exam.scores.length : 0;
        return avgExamScore;
      }),
      label: 'Average Score'
    }];
    
    // Prepare data for pie chart (score distribution)
    const scoreRanges = [0, 0, 0, 0, 0]; // [90-100, 80-89, 70-79, 60-69, <60]
    
    this.grades.forEach(grade => {
      if (grade.score >= 90) scoreRanges[0]++;
      else if (grade.score >= 80) scoreRanges[1]++;
      else if (grade.score >= 70) scoreRanges[2]++;
      else if (grade.score >= 60) scoreRanges[3]++;
      else scoreRanges[4]++;
    });
    
    this.pieChartData.datasets = [{ data: scoreRanges }];
    
    // Prepare data for line chart (performance over time)
    const submissionsByDate = new Map<string, { date: Date, score: number }[]>();
    
    this.submissions.forEach(submission => {
      const submissionDate = new Date(submission.createdAt);
      const dateStr = submissionDate.toISOString().split('T')[0];
      
      if (!submissionsByDate.has(dateStr)) {
        submissionsByDate.set(dateStr, []);
      }
      
      const submissionGrades = this.grades.filter(g => g.submissionId === submission.id);
      if (submissionGrades.length > 0) {
        const avgScore = submissionGrades.reduce((sum, g) => sum + g.score, 0) / submissionGrades.length;
        submissionsByDate.get(dateStr)?.push({ date: submissionDate, score: avgScore });
      }
    });
    
    // Sort dates chronologically
    const sortedDates = Array.from(submissionsByDate.keys()).sort();
    
    // Update line chart data
    this.lineChartData.labels = sortedDates.map(date => {
      const d = new Date(date);
      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    });
    
    this.lineChartData.datasets = [{
      data: sortedDates.map(date => {
        const entries = submissionsByDate.get(date) || [];
        return entries.length > 0 ? 
          entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length : 0;
      }),
      label: 'Performance Over Time',
      fill: false,
      tension: 0.5,
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)'
    }];
  }

  filterByExam(examId: number | null): void {
    this.selectedExamId = examId;
    // Implement filtering logic here if needed
  }
}
