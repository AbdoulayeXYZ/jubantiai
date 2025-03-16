import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../../services/exam.service';
import { Exam } from '../../../models/exam.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exams',
  standalone: false,
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css'
})
export class ExamsComponent implements OnInit {
  exams: Exam[] = [];
  filteredExams: Exam[] = [];
  loading = false;
  error: string | null = null;
  showCreateForm = false;
  examForm: FormGroup;
  selectedFile: File | null = null;
  selectedExam: Exam | null = null;
  isEditing = false;
  sortColumn: string = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  searchTerm: string = '';
  
  constructor(
    private examService: ExamService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.examForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: ['draft'],
      deadline: [null]
    });
  }

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.loading = true;
    this.examService.getTeacherExams().subscribe({
      next: (data) => {
        this.exams = data;
        this.filteredExams = [...this.exams];
        this.sortExams(this.sortColumn, this.sortDirection);
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.message || 'Failed to load exams';
        this.loading = false;
      }
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.examForm.reset({
      title: '',
      description: '',
      status: 'draft',
      deadline: null
    });
    this.selectedFile = null;
    this.selectedExam = null;
    this.isEditing = false;
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0];
    }
  }

  submitExam(): void {
    if (this.examForm.invalid || !this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('title', this.examForm.get('title')?.value);
    formData.append('description', this.examForm.get('description')?.value);
    formData.append('status', this.examForm.get('status')?.value);
    
    if (this.examForm.get('deadline')?.value) {
      formData.append('deadline', new Date(this.examForm.get('deadline')?.value).toISOString());
    }
    
    formData.append('file', this.selectedFile);

    this.loading = true;
    this.examService.createExam(formData).subscribe({
      next: (exam) => {
        this.exams.push(exam);
        this.loading = false;
        this.toggleCreateForm();
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.message || 'Failed to create exam';
        this.loading = false;
      }
    });
  }

  editExam(exam: Exam): void {
    this.selectedExam = exam;
    this.isEditing = true;
    this.showCreateForm = true;
    
    this.examForm.patchValue({
      title: exam.title,
      description: exam.description || '',
      status: exam.status,
      deadline: exam.deadline ? new Date(exam.deadline) : null
    });
  }

  updateExam(): void {
    if (this.examForm.invalid || !this.selectedExam) {
      return;
    }

    const updateData = {
      title: this.examForm.get('title')?.value,
      description: this.examForm.get('description')?.value,
      status: this.examForm.get('status')?.value,
      deadline: this.examForm.get('deadline')?.value ? new Date(this.examForm.get('deadline')?.value) : undefined
    };

    this.loading = true;
    this.examService.updateExam(this.selectedExam.id!, updateData).subscribe({
      next: (updatedExam) => {
        const index = this.exams.findIndex(e => e.id === updatedExam.id);
        if (index !== -1) {
          this.exams[index] = updatedExam;
        }
        this.loading = false;
        this.toggleCreateForm();
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.message || 'Failed to update exam';
        this.loading = false;
      }
    });
  }

  deleteExam(exam: Exam): void {
    if (confirm(`Are you sure you want to delete the exam "${exam.title}"?`)) {
      this.loading = true;
      this.examService.deleteExam(exam.id!).subscribe({
        next: () => {
          this.exams = this.exams.filter(e => e.id !== exam.id);
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.error = error.message || 'Failed to delete exam';
          this.loading = false;
        }
      });
    }
  }

  changeStatus(exam: Exam, status: 'draft' | 'published' | 'closed'): void {
    this.loading = true;
    this.examService.changeExamStatus(exam.id!, status).subscribe({
      next: (updatedExam) => {
        const index = this.exams.findIndex(e => e.id === updatedExam.id);
        if (index !== -1) {
          this.exams[index] = updatedExam;
        }
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.message || 'Failed to update exam status';
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'draft': return 'status-draft';
      case 'published': return 'status-published';
      case 'closed': return 'status-closed';
      default: return '';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'No deadline';
    return new Date(date).toLocaleDateString();
  }

  sortExams(column: string, direction: 'asc' | 'desc'): void {
    this.sortColumn = column;
    this.sortDirection = direction;
    
    this.filteredExams.sort((a, b) => {
      let comparison = 0;
      
      switch (column) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'deadline':
          const dateA = a.deadline ? new Date(a.deadline).getTime() : 0;
          const dateB = b.deadline ? new Date(b.deadline).getTime() : 0;
          comparison = dateA - dateB;
          break;
        case 'submissionsCount':
          const countA = a.submissionsCount || 0;
          const countB = b.submissionsCount || 0;
          comparison = countA - countB;
          break;
        case 'createdAt':
          const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          comparison = createdA - createdB;
          break;
        default:
          return 0;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
  }

  toggleSort(column: string): void {
    const newDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortExams(column, newDirection);
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'fa-sort';
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  searchExams(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.toLowerCase();
    
    if (this.searchTerm) {
      this.filteredExams = this.exams.filter(exam => 
        exam.title.toLowerCase().includes(this.searchTerm) ||
        exam.description?.toLowerCase().includes(this.searchTerm) ||
        exam.status.toLowerCase().includes(this.searchTerm)
      );
    } else {
      this.filteredExams = [...this.exams];
    }
    
    this.sortExams(this.sortColumn, this.sortDirection);
  }

  viewExamDetails(exam: Exam): void {
    // Navigate to exam details page
    this.router.navigate(['/teacher/exams', exam.id]);
  }

  uploadCorrectionTemplate(exam: Exam): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf';
    fileInput.click();
    
    fileInput.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        this.loading = true;
        
        this.examService.uploadCorrectionTemplate(exam.id!, file).subscribe({
          next: (updatedExam) => {
            const index = this.exams.findIndex(e => e.id === updatedExam.id);
            if (index !== -1) {
              this.exams[index] = updatedExam;
              this.filteredExams = [...this.exams];
              this.sortExams(this.sortColumn, this.sortDirection);
            }
            this.loading = false;
          },
          error: (error: HttpErrorResponse) => {
            this.error = error.message || 'Failed to upload correction template';
            this.loading = false;
          }
        });
      }
    };
  }
}
