// manage-exams.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Exam {
  id: number;
  title: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'missed';
  score?: number;
  maxScore?: number;
  isPastDue: boolean;
  details: string;
}

@Component({
  selector: 'app-manage-exams',
  templateUrl: './manage-exams.component.html',
  styleUrls: ['./manage-exams.component.css']
})
export class ManageExamsComponent implements OnInit {
  exams: Exam[] = [];
  selectedExam: Exam | null = null;
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    // In a real application, this would be fetched from a service
    this.exams = [
      {
        id: 1,
        title: 'Mathématiques Avancées',
        date: new Date('2025-03-20'),
        status: 'scheduled',
        isPastDue: false,
        details: 'Durée: 2 heures. Salle: B205. Matériel autorisé: Calculatrice.'
      },
      {
        id: 2,
        title: 'Programmation Web',
        date: new Date('2025-02-15'),
        status: 'completed',
        score: 85,
        maxScore: 100,
        isPastDue: true,
        details: 'Durée: 3 heures. Ce test couvrait Angular, React et Vue.js.'
      },
      {
        id: 3,
        title: 'Base de Données',
        date: new Date('2025-01-10'),
        status: 'completed',
        score: 68,
        maxScore: 100,
        isPastDue: true,
        details: 'Durée: 2 heures. Couvrait SQL, NoSQL et conception de base de données.'
      }
    ];
  }

  showExamDetails(exam: Exam): void {
    this.selectedExam = exam;
  }

  redirectToClaims(examId: number): void {
    // Navigate to claims page with exam ID
    this.router.navigate(['/claims'], { queryParams: { examId: examId } });
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}