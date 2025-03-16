import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExamService } from '../../../services/exam.service';
import { SubmissionService } from '../../../services/submission.service';
import { GradeService } from '../../../services/grade.service';
import { Exam } from '../../../models/exam.model';
import { Submission, SubmissionWithDetails } from '../../../models/submission.model';
import { Grade, CreateGradeDto } from '../../../models/grade.model';

@Component({
  selector: 'app-corrections',
  standalone: false,
  templateUrl: './corrections.component.html',
  styleUrl: './corrections.component.css'
})
export class CorrectionsComponent implements OnInit {
  exams: Exam[] = [];
  submissions: Submission[] = [];
  selectedExam: Exam | null = null;
  selectedSubmission: SubmissionWithDetails | null = null;
  grades: Grade[] = [];
  loading = false;
  error: string | null = null;
  gradeForm: FormGroup;
  showGradeForm = false;
  editingGradeId: number | null = null;

  constructor(
    private examService: ExamService,
    private submissionService: SubmissionService,
    private gradeService: GradeService,
    private fb: FormBuilder
  ) {
    this.gradeForm = this.fb.group({
      score: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      comment: [''],
      isAutoGenerated: [false]
    });
  }

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.loading = true;
    this.examService.getTeacherExams().subscribe({
      next: (exams) => {
        this.exams = exams;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load exams. Please try again.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadSubmissions(examId: number): void {
    this.loading = true;
    this.selectedExam = this.exams.find(exam => exam.id === examId) || null;
    this.selectedSubmission = null;
    this.submissionService.getSubmissionsByExam(examId).subscribe({
      next: (submissions) => {
        this.submissions = submissions;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load submissions. Please try again.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadSubmissionDetails(submissionId: number): void {
    this.loading = true;
    this.submissionService.getSubmissionById(submissionId).subscribe({
      next: (submission) => {
        this.selectedSubmission = submission;
        this.grades = submission.grades || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load submission details. Please try again.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  downloadSubmission(filePath: string): void {
    this.loading = true;
    this.submissionService.downloadSubmission(filePath).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filePath.split('/').pop() || 'submission.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to download submission. Please try again.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  openGradeForm(grade?: Grade): void {
    this.showGradeForm = true;
    this.editingGradeId = grade?.id || null;
    
    if (grade) {
      this.gradeForm.patchValue({
        score: grade.score,
        comment: grade.comment || '',
        isAutoGenerated: grade.isAutoGenerated
      });
    } else {
      this.gradeForm.reset({
        score: '',
        comment: '',
        isAutoGenerated: false
      });
    }
  }

  submitGrade(): void {
    if (this.gradeForm.invalid || !this.selectedSubmission) {
      return;
    }

    this.loading = true;
    const formValue = this.gradeForm.value;

    if (this.editingGradeId) {
      // Update existing grade
      this.gradeService.updateGrade(this.editingGradeId, {
        score: formValue.score,
        comment: formValue.comment
      }).subscribe({
        next: (updatedGrade) => {
          const index = this.grades.findIndex(g => g.id === this.editingGradeId);
          if (index !== -1) {
            this.grades[index] = updatedGrade;
          }
          this.showGradeForm = false;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to update grade. Please try again.';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      // Create new grade
      const newGrade: CreateGradeDto = {
        score: formValue.score,
        comment: formValue.comment,
        submissionId: this.selectedSubmission.id,
        isAutoGenerated: formValue.isAutoGenerated
      };

      this.gradeService.createGrade(newGrade).subscribe({
        next: (grade) => {
          this.grades.push(grade);
          this.showGradeForm = false;
          this.loading = false;
          
          // Update submission status if needed
          if (this.selectedSubmission && this.selectedSubmission.status !== 'graded') {
            this.submissionService.updateSubmission(this.selectedSubmission.id, {
              status: 'graded'
            }).subscribe({
              next: (updatedSubmission) => {
                if (this.selectedSubmission) {
                  this.selectedSubmission.status = updatedSubmission.status;
                }
              },
              error: (err) => console.error('Failed to update submission status', err)
            });
          }
        },
        error: (err) => {
          this.error = 'Failed to create grade. Please try again.';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  validateGrade(gradeId: number): void {
    this.loading = true;
    this.gradeService.validateGrade(gradeId).subscribe({
      next: (validatedGrade) => {
        const index = this.grades.findIndex(g => g.id === gradeId);
        if (index !== -1) {
          this.grades[index] = validatedGrade;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to validate grade. Please try again.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'submitted': return 'status-submitted';
      case 'graded': return 'status-graded';
      default: return '';
    }
  }

  closeError(): void {
    this.error = null;
  }
}
