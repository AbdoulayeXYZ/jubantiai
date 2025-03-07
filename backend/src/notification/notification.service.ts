import { Exam } from '../entities/exam.entity';

export class NotificationService {
    async notifyNewExam(exam: Exam): Promise<void> {
        // TODO: Implement notification logic
        // This could send emails, push notifications, etc.
        console.log(`New exam notification: ${exam.title}`);
    }

    async notifyExamGraded(examId: number, studentId: number): Promise<void> {
        console.log(`Exam ${examId} graded for student ${studentId}`);
    }
} 