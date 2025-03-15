import { Component, OnInit } from '@angular/core';

interface Classroom {
  id: number;
  name: string;
  exams: Exam[];
}

interface Exam {
  id: number;
  title: string;
  status: 'draft' | 'published';
}

@Component({
  selector: 'app-classrooms',
  templateUrl: './classrooms.component.html',
  styleUrls: ['./classrooms.component.css'],
  standalone:false

})
export class ClassroomsComponent implements OnInit {
  classrooms: Classroom[] = [
    { id: 1, name: 'DIC1', exams: [
      { id: 101, title: 'Math Exam', status: 'draft' },
      { id: 102, title: 'Science Exam', status: 'published' }
    ]},
    { id: 2, name: 'DIC2', exams: [
      { id: 201, title: 'History Exam', status: 'draft' }
    ]}
  ];

  selectedClassroom: Classroom | null = null;

  constructor() {}

  ngOnInit(): void {}

  selectClassroom(classroom: Classroom): void {
    this.selectedClassroom = classroom;
  }

  publishExam(examId: number): void {
    const exam = this.selectedClassroom?.exams.find(exam => exam.id === examId);
    if (exam) {
      exam.status = 'published';
    }
  }
}
