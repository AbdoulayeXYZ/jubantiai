import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../../services/exam.service';
import { GradeService } from '../../../services/grade.service';
import { SubmissionService } from '../../../services/submission.service';
import { UserService } from '../../../services/user.service';
import { Exam } from '../../../models/exam.model';
import { Grade } from '../../../models/grade.model';
import { Submission, SubmissionWithDetails } from '../../../models/submission.model';
import { User } from '../../../models/auth.model';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-studentstats',
  standalone: false,
  templateUrl: './studentstats.component.html',
  styleUrl: './studentstats.component.css'
})
export class StudentstatsComponent implements OnInit {
  // Data properties
  exams: Exam[] = [];
  submissions: Submission[] = [];
  grades: Grade[] = [];
  students: User[] = [];
  loading = true;
  error = '';
  selectedExamId: number | null = null;
  
  // Performance metrics
  averageScore = 0;
  totalSubmissions = 0;
  gradedSubmissions = 0;
  pendingSubmissions = 0;
  lateSubmissions = 0;
  
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
    private examService: ExamService,
    private gradeService: GradeService,
    private submissionService: SubmissionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadTeacherExams();
    this.loadStudents();
  }

  loadTeacherExams(): void {
    this.loading = true;
    this.examService.getTeacherExams().subscribe({
      next: (data) => {
        this.exams = data;
        this.loadAllSubmissions();
      },
      error: (err) => {
        this.error = 'Échec du chargement des examens';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadStudents(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.students = users.filter(user => user.role === 'student');
      },
      error: (err) => {
        console.error('Échec du chargement des étudiants', err);
      }
    });
  }

  loadAllSubmissions(): void {
    if (this.exams.length === 0) {
      this.loading = false;
      return;
    }

    const examIds = this.exams.map(exam => exam.id);
    let allSubmissions: Submission[] = [];
    let completedRequests = 0;

    examIds.forEach(examId => {
      if (examId) {
        this.submissionService.getSubmissionsByExam(examId).subscribe({
          next: (submissions) => {
            allSubmissions = [...allSubmissions, ...submissions];
            completedRequests++;
            
            if (completedRequests === examIds.length) {
              this.submissions = allSubmissions;
              this.loadAllGrades();
            }
          },
          error: (err) => {
            console.error(`Échec du chargement des soumissions pour l'examen ${examId}`, err);
            completedRequests++;
            
            if (completedRequests === examIds.length) {
              this.submissions = allSubmissions;
              this.loadAllGrades();
            }
          }
        });
      }
    });
  }

  loadAllGrades(): void {
    if (this.submissions.length === 0) {
      this.loading = false;
      return;
    }

    const examIds = this.exams.map(exam => exam.id).filter(id => id !== undefined) as number[];
    let allGrades: Grade[] = [];
    let completedRequests = 0;

    examIds.forEach(examId => {
      this.gradeService.getGradesByExam(examId).subscribe({
        next: (grades) => {
          // Ensure grades is an array before spreading
          const gradesArray = Array.isArray(grades) ? grades : [];
          allGrades = [...allGrades, ...gradesArray];
          completedRequests++;
          
          if (completedRequests === examIds.length) {
            this.grades = allGrades;
            this.calculatePerformanceMetrics();
            this.prepareChartData();
            this.loading = false;
          }
        },
        error: (err) => {
          console.error(`Échec du chargement des notes pour l'examen ${examId}`, err);
          completedRequests++;
          
          if (completedRequests === examIds.length) {
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
    this.pendingSubmissions = this.submissions.filter(s => s.status === 'pending').length;
    this.lateSubmissions = this.submissions.filter(s => s.isLate).length;
  }

  prepareChartData(): void {
    if (this.submissions.length === 0 || this.grades.length === 0) return;

    // Prepare data for bar chart (average scores by student)
    const studentMap = new Map<number, { name: string, scores: number[] }>();
    
    this.submissions.forEach(submission => {
      const studentId = submission.studentId;
      const student = this.students.find(s => s.id === studentId);
      const studentName = student ? student.email : `Étudiant ${studentId}`;
      
      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, { name: studentName, scores: [] });
      }
      
      const submissionGrades = this.grades.filter(g => g.submissionId === submission.id);
      if (submissionGrades.length > 0) {
        const avgScore = submissionGrades.reduce((sum, g) => sum + g.score, 0) / submissionGrades.length;
        studentMap.get(studentId)?.scores.push(avgScore);
      }
    });
    
    // Update bar chart data
    this.barChartData.labels = Array.from(studentMap.values()).map(student => student.name);
    this.barChartData.datasets = [{
      data: Array.from(studentMap.values()).map(student => {
        const avgStudentScore = student.scores.length > 0 ? 
          student.scores.reduce((sum, score) => sum + score, 0) / student.scores.length : 0;
        return avgStudentScore;
      }),
      label: 'Note moyenne'
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
    
    this.pieChartData.datasets = [{ 
      data: scoreRanges,
      backgroundColor: [
        'rgba(75, 192, 192, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(255, 99, 132, 0.7)'
      ]
    }];
    
    // Prepare data for line chart (performance by exam)
    const examMap = new Map<number, { name: string, avgScore: number, date: Date }>();
    
    this.exams.forEach(exam => {
      if (exam.id) {
        const examSubmissions = this.submissions.filter(s => s.examId === exam.id);
        const examGrades: Grade[] = [];
        
        examSubmissions.forEach(submission => {
          const submissionGrades = this.grades.filter(g => g.submissionId === submission.id);
          examGrades.push(...submissionGrades);
        });
        
        if (examGrades.length > 0) {
          const avgScore = examGrades.reduce((sum, g) => sum + g.score, 0) / examGrades.length;
          examMap.set(exam.id, { 
            name: exam.title, 
            avgScore, 
            date: exam.createdAt ? new Date(exam.createdAt) : new Date() 
          });
        }
      }
    });
    
    // Sort exams chronologically
    const sortedExams = Array.from(examMap.values()).sort((a, b) => {
      // Ensure both dates are Date objects before calling getTime()
      const dateA = a.date instanceof Date ? a.date : new Date(a.date || 0);
      const dateB = b.date instanceof Date ? b.date : new Date(b.date || 0);
      return dateA.getTime() - dateB.getTime();
    });
    
    // Update line chart data
    this.lineChartData.labels = sortedExams.map(exam => exam.name);
    this.lineChartData.datasets = [{
      data: sortedExams.map(exam => exam.avgScore),
      label: 'Performance par examen',
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

  getStudentName(studentId: number): string {
    const student = this.students.find(s => s.id === studentId);
    return student ? student.email : `Étudiant ${studentId}`;
  }

  getExamTitle(examId: number): string {
    const exam = this.exams.find(e => e.id === examId);
    return exam ? exam.title : `Examen ${examId}`;
  }
}
