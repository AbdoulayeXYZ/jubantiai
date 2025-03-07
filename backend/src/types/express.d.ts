declare namespace Express {
    interface Request {
        user?: {
            id: number;
            role: 'teacher' | 'student';
        };
    }
} 