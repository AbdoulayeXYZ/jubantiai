export interface ISubmission {
  id: number;
  studentId: number;
  examId: number;
  submissionDate: Date;
  filePath: string; // Path to the submitted file
  grade?: number; // Optional grade field
  feedback?: string; // Optional feedback field
}
