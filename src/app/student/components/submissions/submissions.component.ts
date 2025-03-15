// submissions.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

interface Submission {
  id: number;
  examTitle: string;
  dueDate: Date;
  status: 'pending' | 'submitted' | 'late' | 'graded';
  grade?: number;
  feedback?: string;
  fileUrl?: string;
  submitDate?: Date;
}

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css']
})
export class SubmissionsComponent implements OnInit {
  submissions: Submission[] = [];
  selectedSubmission: Submission | null = null;
  uploadForm: FormGroup;
  showUploadModal = false;
  uploading = false;
  uploadSuccess = false;
  uploadError = false;
  
  constructor(private fb: FormBuilder) {
    this.uploadForm = this.fb.group({
      submissionFile: ['']
    });
  }

  ngOnInit(): void {
    // Mock data - in a real application, you would fetch this from a service
    this.submissions = [
      {
        id: 1,
        examTitle: 'Programmation Web - Devoir 1',
        dueDate: new Date('2025-03-20T23:59:59'),
        status: 'pending'
      },
      {
        id: 2,
        examTitle: 'Mathématiques Discrètes - Contrôle',
        dueDate: new Date('2025-03-25T23:59:59'),
        status: 'pending'
      },
      {
        id: 3,
        examTitle: 'Base de Données - Projet',
        dueDate: new Date('2025-04-05T23:59:59'),
        status: 'pending'
      },
      {
        id: 4,
        examTitle: 'Algorithmes - Test 2',
        dueDate: new Date('2025-02-15T23:59:59'),
        status: 'submitted',
        submitDate: new Date('2025-02-14T14:30:00'),
        fileUrl: 'algorithmes_test2_submission.pdf'
      },
      {
        id: 5,
        examTitle: 'Sécurité Informatique - Examen',
        dueDate: new Date('2025-01-10T23:59:59'),
        status: 'graded',
        submitDate: new Date('2025-01-09T16:45:00'),
        fileUrl: 'securite_exam_submission.pdf',
        grade: 85,
        feedback: 'Bon travail! Quelques concepts de cryptographie pourraient être approfondis.'
      }
    ];
  }

  selectSubmission(submission: Submission): void {
    this.selectedSubmission = submission;
  }

  openUploadModal(submission: Submission): void {
    this.selectedSubmission = submission;
    this.showUploadModal = true;
    this.uploadSuccess = false;
    this.uploadError = false;
    this.resetUploadForm();
  }

  closeUploadModal(): void {
    this.showUploadModal = false;
    this.resetUploadForm();
  }

  resetUploadForm(): void {
    this.uploadForm.reset();
  }

  onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = (target.files as FileList)[0];
    
    if (file) {
      // Ensure it's a PDF
      if (file.type !== 'application/pdf') {
        alert('Veuillez sélectionner un fichier PDF.');
        this.resetUploadForm();
        return;
      }
      
      // Check file size (e.g., limit to 10 MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('La taille du fichier ne doit pas dépasser 10 MB.');
        this.resetUploadForm();
        return;
      }
      
      this.uploadForm.get('submissionFile')?.setValue(file);
    }
  }

  submitAssignment(): void {
    if (!this.uploadForm.get('submissionFile')?.value) {
      alert('Veuillez sélectionner un fichier.');
      return;
    }
    
    this.uploading = true;
    
    // Simulate file upload with a timeout
    setTimeout(() => {
      // In a real app, you would send the file to your server here
      
      // Simulate successful upload
      if (this.selectedSubmission) {
        // Update submission status in the local array
        const submissionIndex = this.submissions.findIndex(s => s.id === this.selectedSubmission?.id);
        if (submissionIndex !== -1) {
          this.submissions[submissionIndex].status = 'submitted';
          this.submissions[submissionIndex].submitDate = new Date();
          this.submissions[submissionIndex].fileUrl = 'submission_' + this.selectedSubmission.id + '.pdf';
          
          // Update selected submission as well
          this.selectedSubmission = { ...this.submissions[submissionIndex] };
        }
      }
      
      this.uploading = false;
      this.uploadSuccess = true;
      
      // Close modal after success message is shown
      setTimeout(() => {
        this.closeUploadModal();
      }, 2000);
    }, 1500);
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

  isOverdue(date: Date): boolean {
    return new Date() > date;
  }

  getRemainingTime(date: Date): string {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff < 0) {
      return 'En retard';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} jour${days > 1 ? 's' : ''} et ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours} heure${hours > 1 ? 's' : ''} et ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  }
}