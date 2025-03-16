import { User } from './auth.model';
import { Submission } from './submission.model';

export interface Grade {
  id: number;
  score: number;
  comment?: string;
  submissionId: number;
  criteriaId?: number;
  isAutoGenerated: boolean;
  isValidated: boolean;
  validatedBy?: number;
  aiJustification?: string;
  createdAt: Date;
  updatedAt: Date;
  submission?: Submission;
  validator?: User;
}

export interface CreateGradeDto {
  score: number;
  comment?: string;
  submissionId: number;
  criteriaId?: number;
  isAutoGenerated: boolean;
  aiJustification?: string;
}

export interface UpdateGradeDto {
  score?: number;
  comment?: string;
  isValidated?: boolean;
  validatedBy?: number;
}

export interface GradeSummary {
  averageScore: number;
  totalSubmissions: number;
  gradedSubmissions: number;
  pendingSubmissions: number;
}