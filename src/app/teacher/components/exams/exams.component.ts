import { Component, OnInit } from '@angular/core';
//import { fail } from 'assert';

interface Exam {
  id: number;
  title: string;
  description: string;
  status: 'draft' | 'published';
}

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css'],
  standalone:false
})
export class ExamsComponent implements OnInit {
  exams: Exam[] = [
    { id: 1, title: 'Examen de Math', description: 'Compétences de base en mathématiques', status: 'draft' },
    { id: 2, title: 'Examen de Science', description: 'Questions générales de science', status: 'draft' },
  ];

  newExam: Exam = { id: 0, title: '', description: '', status: 'draft' };

  constructor() {}

  ngOnInit(): void {}

  createExam(): void {
    this.newExam.id = this.exams.length + 1;
    this.exams.push({ ...this.newExam });
    this.newExam = { id: 0, title: '', description: '', status: 'draft' };
  }

  // Méthode pour supprimer un examen
  deleteExam(examId: number): void {
    this.exams = this.exams.filter(exam => exam.id !== examId);
  }
}