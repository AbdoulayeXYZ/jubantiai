export class NotificationService {
    async notifyTeacher(teacherId: number, message: string, link: string): Promise<void> {
        // TODO: Implement actual notification logic (e.g., email, websocket, etc.)
        console.log(`Notification to teacher ${teacherId}: ${message} - Link: ${link}`);
    }

    async notifyStudent(studentId: number, message: string, link: string): Promise<void> {
        // TODO: Implement actual notification logic
        console.log(`Notification to student ${studentId}: ${message} - Link: ${link}`);
    }
} 