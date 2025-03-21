import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../../services/exam.service';
import { Exam } from '../../../models/exam.model';
import { Grade } from '../../../models/grade.model';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-exams',
  standalone: false,
  templateUrl: './manage-exams.component.html',
  styleUrl: './manage-exams.component.css'
})
export class ManageExamsComponent implements OnInit {
  exams: Exam[] = [];
  loading = false;
  error = '';
  selectedExam: Exam | null = null;
  fileToUpload: File | null = null;
  submissionSuccess = false;
  submissionError = '';
  autoGrade: Grade | null = null;

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.loading = true;
    this.examService.getPublishedExams().subscribe({
      next: (exams) => {
        this.exams = exams;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des examens. Veuillez réessayer.';
        this.loading = false;
        console.error('Erreur lors du chargement des examens:', err);
      }
    });
  }

  viewExamDetails(exam: Exam): void {
    this.selectedExam = exam;
  }

  closeExamDetails(): void {
    this.selectedExam = null;
    this.fileToUpload = null;
    this.submissionSuccess = false;
    this.submissionError = '';
    this.autoGrade = null;
  }

  downloadExamSubject(exam: Exam): void {
    this.loading = true;
    this.examService.downloadExamSubject(exam.id!).subscribe({
      next: (blob) => {
        saveAs(blob, `${exam.title}_sujet.pdf`);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du téléchargement du sujet. Veuillez réessayer.';
        this.loading = false;
        console.error('Erreur lors du téléchargement du sujet:', err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.fileToUpload = element.files[0];
    }
  }

  submitExamResponse(): void {
    if (!this.selectedExam || !this.fileToUpload) {
      this.submissionError = 'Veuillez sélectionner un fichier à soumettre.';
      return;
    }

    this.loading = true;
    this.autoGrade = null; // Réinitialiser la note automatique
    
    // Utiliser la nouvelle méthode avec notation automatique
    this.examService.submitExamResponseWithGrading(this.selectedExam.id!, this.fileToUpload).subscribe({
      next: (response) => {
        this.submissionSuccess = true;
        this.submissionError = '';
        this.loading = false;
        this.fileToUpload = null;
        
        // Récupérer et afficher la note automatique si disponible
        if (response && response.grade) {
          this.autoGrade = response.grade;
        }
      },
      error: (err) => {
        this.submissionSuccess = false;
        this.loading = false;
        
        if (err.status === 500) {
          this.submissionError = 'Erreur serveur lors de la soumission. Veuillez contacter l\'administrateur.';
        } else if (err.status === 413) {
          this.submissionError = 'Le fichier est trop volumineux. Veuillez soumettre un fichier plus petit.';
        } else if (err.status === 415) {
          this.submissionError = 'Format de fichier non supporté. Veuillez soumettre un fichier au format PDF, DOC ou DOCX.';
        } else if (err.status === 403) {
          // Message plus précis pour les erreurs d'autorisation
          if (err.error && err.error.message) {
            this.submissionError = err.error.message;
          } else {
            this.submissionError = 'Accès refusé. Vous n\'avez pas les droits nécessaires pour soumettre cet examen. Seuls les étudiants peuvent soumettre des examens.';
          }
        } else {
          this.submissionError = 'Erreur lors de la soumission. Veuillez réessayer.';
        }
        
        console.error('Erreur lors de la soumission:', err);
      }
    });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'published': return 'Publié';
      case 'closed': return 'Fermé';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'published': return 'status-published';
      case 'closed': return 'status-closed';
      case 'draft': return 'status-draft';
      default: return '';
    }
  }
}
