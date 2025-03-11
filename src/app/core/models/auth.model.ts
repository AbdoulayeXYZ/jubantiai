// User models
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher';
}

// Auth models
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher';
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Exam models
export interface Question {
  id?: string;
  text: string;
  type: 'multiple_choice' | 'text' | 'true_false';
  options?: string[];
  correctAnswer: string | boolean;
  points: number;
}

export interface Exam {
  id?: string;
  title: string;
  description: string;
  duration: number; // en minutes
  startDate: Date;
  endDate: Date;
  teacherId: string;
  questions: Question[];
  status: 'draft' | 'published' | 'in_progress' | 'completed';
  totalPoints?: number;
  subject?: string;
  grade?: string;
}

export interface ExamSubmission {
  id?: string;
  examId: string;
  studentId: string;
  answers: {
    questionId: string;
    answer: string | boolean;
  }[];
  submittedAt: Date;
  score?: number;
  status: 'in_progress' | 'submitted' | 'graded';
  timeSpent?: number; // en minutes
}

// Notification models
export interface Notification {
  id: string;
  userId: string;
  type: 'exam_scheduled' | 'exam_reminder' | 'exam_graded' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  metadata?: {
    examId?: string;
    submissionId?: string;
    [key: string]: any;
  };
}

// Analytics models
export interface TeacherAnalytics {
  totalExams: number;
  totalStudents: number;
  examsByStatus: {
    draft: number;
    published: number;
    in_progress: number;
    completed: number;
  };
  averageScores: {
    examId: string;
    examTitle: string;
    averageScore: number;
  }[];
  studentPerformance: {
    studentId: string;
    studentName: string;
    averageScore: number;
    examsCompleted: number;
  }[];
}

export interface StudentAnalytics {
  totalExamsTaken: number;
  averageScore: number;
  examScores: {
    examId: string;
    examTitle: string;
    score: number;
    date: Date;
  }[];
  performanceBySubject: {
    subject: string;
    averageScore: number;
    examsTaken: number;
  }[];
  upcomingExams: {
    examId: string;
    examTitle: string;
    date: Date;
  }[];
} 