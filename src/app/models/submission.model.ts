import { User } from './auth.model';
import { Exam } from './exam.model';
import { Grade } from './grade.model';

export interface Submission {
  id: number;
  filePath: string;
  status: 'pending' | 'submitted' | 'graded';
  feedback?: string;
  studentId: number;
  examId: number;
  isLate: boolean;
  createdAt: Date;
  updatedAt: Date;
  student?: User;
  exam?: Exam;
  grades?: Grade[];
}

export interface SubmissionWithDetails extends Submission {
  student: User;
  exam: Exam;
  grades: Grade[];
}

export interface SubmissionFilters {
  examId?: number;
  studentId?: number;
  status?: 'pending' | 'submitted' | 'graded';
}