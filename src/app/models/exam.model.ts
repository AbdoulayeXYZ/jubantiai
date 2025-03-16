export interface Exam {
  id?: number;
  title: string;
  description?: string;
  subjectPath: string;
  correctionTemplatePath?: string;
  status: 'draft' | 'published' | 'closed';
  deadline?: Date;
  teacherId: number;
  createdAt?: Date;
  updatedAt?: Date;
  submissionsCount?: number;
}

export interface CreateExamDto {
  title: string;
  description?: string;
  status?: 'draft' | 'published' | 'closed';
  deadline?: Date;
}

export interface UpdateExamDto {
  title?: string;
  description?: string;
  status?: 'draft' | 'published' | 'closed';
  deadline?: Date;
  correctionTemplatePath?: string;
}