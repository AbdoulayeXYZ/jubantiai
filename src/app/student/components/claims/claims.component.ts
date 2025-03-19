import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Claim {
  id: number;
  examId: number;
  examTitle: string;
  submissionDate: string;
  status: string;
  reason: string;
  description: string;
  response?: string;
}

interface Exam {
  id: number;
  title: string;
}

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})
export class ClaimsComponent implements OnInit {
  claims: Claim[] = [];
  selectedClaim: Claim | null = null;
  showNewClaimForm: boolean = false;
  showResponseModal: boolean = false;
  selectedExam: number | null = null;
  claimType: string = '';
  claimDescription: string = '';
  selectedFile: File | null = null;

  exams: Exam[] = [
    { id: 1, title: 'Programming Fundamentals' },
    { id: 2, title: 'Data Structures' },
    { id: 3, title: 'Web Development' },
    { id: 4, title: 'Database Design' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    // Simuler des données d'API
    this.claims = [
      {
        id: 1,
        examId: 3,
        examTitle: 'Web Development',
        submissionDate: '2025-03-12',
        status: 'Under Review',
        reason: 'Grading Error',
        description: 'I believe there was an error in grading my CSS implementation.'
      },
      {
        id: 2,
        examId: 4,
        examTitle: 'Database Design',
        submissionDate: '2025-03-07',
        status: 'Resolved',
        reason: 'Technical Issue',
        description: 'The database server was down for 10 minutes.',
        response: 'Claim approved. 10 points added to your score.'
      }
    ];
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  isFormValid(): boolean {
    return !!this.selectedExam && !!this.claimType && this.claimDescription.length >= 10;
  }

  submitClaim(): void {
    if (this.isFormValid()) {
      const newClaim: Claim = {
        id: this.claims.length + 1,
        examId: this.selectedExam!,
        examTitle: this.exams.find(e => e.id === this.selectedExam)?.title || 'Unknown Exam',
        submissionDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        reason: this.claimType,
        description: this.claimDescription
      };
      this.claims.unshift(newClaim);
      this.closeNewClaimForm();
    }
  }

  cancelClaim(claimId: number): void {
    this.claims = this.claims.filter(claim => claim.id !== claimId);
  }

  viewResponse(claimId: number): void {
    this.selectedClaim = this.claims.find(claim => claim.id === claimId) || null;
    this.showResponseModal = true;
  }

  closeResponseModal(): void {
    this.showResponseModal = false;
  }

  openNewClaimForm(): void {
    this.showNewClaimForm = true;
  }

  closeNewClaimForm(): void {
    this.showNewClaimForm = false;
    this.selectedExam = null;
    this.claimType = '';
    this.claimDescription = '';
    this.selectedFile = null;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Under Review': return 'status-under-review';
      case 'Resolved': return 'status-resolved';
      default: return '';
    }
  }
}