// src/app/teacher/models/models.ts
export interface Classroom {
    id: number;
    name: string;
    exams: Exam[];
  }
  
  export interface Exam {
    id: number;
    title: string;
    status: 'pending' | 'corrected';
  }
  
  export interface Correction {
    examId: number;
    status: 'loading' | 'completed';
  }