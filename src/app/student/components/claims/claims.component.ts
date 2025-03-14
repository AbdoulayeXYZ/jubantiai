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
  filteredClaims: Claim[] = [];
  selectedClaim: Claim | null = null;
  showNewClaimForm: boolean = false;
  claimForm: FormGroup;
  
  exams: Exam[] = [
    { id: 1, title: 'Programming Fundamentals' },
    { id: 2, title: 'Data Structures' },
    { id: 3, title: 'Web Development' },
    { id: 4, title: 'Database Design' }
  ];
  
  filterStatus: string = 'all';
  
  constructor(private fb: FormBuilder) {
    this.claimForm = this.fb.group({
      examId: ['', Validators.required],
      reason: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.loadClaims();
    this.filterClaims();
  }

  loadClaims(): void {
    // Simulating API data
    this.claims = [
      {
        id: 1,
        examId: 3,
        examTitle: 'Web Development',
        submissionDate: '2025-03-12',
        status: 'Under Review',
        reason: 'Grading Error',
        description: 'I believe there was an error in grading my CSS implementation. The requirements were met but points were deducted.'
      },
      {
        id: 2,
        examId: 4,
        examTitle: 'Database Design',
        submissionDate: '2025-03-07',
        status: 'Resolved',
        reason: 'Technical Issue',
        description: 'During the exam, the database server was down for 10 minutes which prevented me from completing the last question.',
        response: 'Claim approved. 10 points have been added to your final score.'
      }
    ];
  }

  filterClaims(): void {
    if (this.filterStatus === 'all') {
      this.filteredClaims = [...this.claims];
    } else {
      this.filteredClaims = this.claims.filter(claim => 
        claim.status.toLowerCase().replace(' ', '-') === this.filterStatus);
    }
  }

  onFilterChange(status: string): void {
    this.filterStatus = status;
    this.filterClaims();
  }

  viewClaimDetails(claim: Claim): void {
    this.selectedClaim = claim;
  }

  closeClaimDetails(): void {
    this.selectedClaim = null;
  }

  openNewClaimForm(): void {
    this.showNewClaimForm = true;
  }

  closeNewClaimForm(): void {
    this.showNewClaimForm = false;
    this.claimForm.reset();
  }

  getExamTitle(examId: number): string {
    const exam = this.exams.find(e => e.id === examId);
    return exam ? exam.title : 'Unknown Exam';
  }

  submitClaim(): void {
    if (this.claimForm.valid) {
      const formValue = this.claimForm.value;
      const newClaim: Claim = {
        id: this.claims.length + 1,
        examId: formValue.examId,
        examTitle: this.getExamTitle(formValue.examId),
        submissionDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        reason: formValue.reason,
        description: formValue.description
      };
      
      this.claims.unshift(newClaim);
      this.filterClaims();
      this.closeNewClaimForm();
      
      // In a real app, you would send this to an API
      console.log('Submitting claim:', newClaim);
    }
  }
}