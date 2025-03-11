import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExamService, IExam, ICreateExamDto } from '../../../../core/services/exam.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Message d'erreur -->
      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <span class="block sm:inline">{{ error }}</span>
      </div>

      <!-- Création d'examen -->
      <div class="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-bold mb-6">Créer un nouvel examen</h2>
        <form [formGroup]="examForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Titre</label>
            <input type="text" formControlName="title"
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea formControlName="description" rows="3"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Date limite</label>
            <input type="datetime-local" formControlName="deadline"
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Sujet (PDF)</label>
            <input type="file" (change)="onFileSelected($event)" accept=".pdf"
                   class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Statut</label>
            <select formControlName="status"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="closed">Fermé</option>
            </select>
          </div>
          
          <button type="submit" 
                  [disabled]="!examForm.valid || !selectedFile"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
            Créer l'examen
          </button>
        </form>
      </div>

      <!-- Liste des examens -->
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-6">Mes examens</h2>
        <div class="space-y-4">
          <div *ngFor="let exam of exams" class="border rounded-lg p-4">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-semibold">{{ exam.title }}</h3>
                <p class="text-gray-600">{{ exam.description }}</p>
                <div class="mt-2 space-x-2">
                  <span [class]="getStatusClass(exam.status)">
                    {{ getStatusLabel(exam.status) }}
                  </span>
                  <span class="text-sm text-gray-500" *ngIf="exam.deadline">
                    Date limite: {{ exam.deadline | date:'dd/MM/yyyy HH:mm' }}
                  </span>
                </div>
              </div>
              <div class="flex space-x-2">
                <button (click)="updateExamStatus(exam.id!, 'published')" 
                        *ngIf="exam.status === 'draft'"
                        class="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700">
                  Publier
                </button>
                <button (click)="updateExamStatus(exam.id!, 'closed')" 
                        *ngIf="exam.status === 'published'"
                        class="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700">
                  Fermer
                </button>
                <button (click)="deleteExam(exam.id!)" 
                        class="px-3 py-1 text-sm text-white bg-gray-600 rounded hover:bg-gray-700">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  examForm: FormGroup;
  selectedFile: File | null = null;
  exams: IExam[] = [];
  error: string | null = null;
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private authService: AuthService,
    private router: Router
  ) {
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      deadline: [''],
      status: ['draft', Validators.required]
    });
  }

  ngOnInit() {
    // Chargement initial du dashboard sans les examens
    this.isLoading = false;
    
    // Chargement des examens après un délai pour s'assurer que le token est disponible
    setTimeout(() => {
      console.log('Initializing exam loading...');
      console.log('Current token:', this.authService.getToken());
      this.loadExams();
    }, 2000);
  }

  loadExams() {
    console.log('Loading exams...');
    const token = this.authService.getToken();
    if (!token) {
      console.error('No token available');
      this.error = "Session expirée. Veuillez vous reconnecter.";
      this.router.navigate(['/auth/login']);
      return;
    }

    this.examService.getExams().subscribe({
      next: (exams: IExam[]) => {
        console.log('Exams loaded successfully:', exams);
        this.exams = exams;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des examens:', error);
        if (error.status === 401) {
          this.error = "Session expirée. Veuillez vous reconnecter.";
          this.authService.logout();
        } else {
          this.error = "Erreur lors du chargement des examens. Veuillez réessayer.";
        }
        this.exams = [];
      }
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.examForm.valid && this.selectedFile) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.error = "Session expirée. Veuillez vous reconnecter.";
        this.router.navigate(['/auth/login']);
        return;
      }

      const token = this.authService.getToken();
      if (!token) {
        this.error = "Session expirée. Veuillez vous reconnecter.";
        this.router.navigate(['/auth/login']);
        return;
      }

      const formValues = this.examForm.value;
      const examData: ICreateExamDto = {
        ...formValues,
        deadline: formValues.deadline ? new Date(formValues.deadline) : undefined,
        teacherId: currentUser.id
      };
      
      this.examService.createExam(examData, this.selectedFile).subscribe({
        next: (exam) => {
          this.examForm.reset({ status: 'draft' });
          this.selectedFile = null;
          this.loadExams();
          this.error = null;
        },
        error: (error) => {
          console.error('Erreur lors de la création de l\'examen:', error);
          if (error.status === 401) {
            this.error = "Session expirée. Veuillez vous reconnecter.";
            this.authService.logout();
          } else {
            this.error = "Erreur lors de la création de l'examen. Veuillez réessayer.";
          }
        }
      });
    }
  }

  updateExamStatus(examId: number, status: 'draft' | 'published' | 'closed') {
    this.examService.updateExam(examId, { status }).subscribe({
      next: () => {
        this.loadExams();
        this.error = null;
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        this.error = "Erreur lors de la mise à jour du statut";
      }
    });
  }

  deleteExam(examId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet examen ?')) {
      this.examService.deleteExam(examId).subscribe({
        next: () => {
          this.loadExams();
          this.error = null;
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.error = "Erreur lors de la suppression de l'examen";
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'draft':
        return 'px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800';
      case 'published':
        return 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800';
      case 'closed':
        return 'px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'draft':
        return 'Brouillon';
      case 'published':
        return 'Publié';
      case 'closed':
        return 'Fermé';
      default:
        return status;
    }
  }
}
