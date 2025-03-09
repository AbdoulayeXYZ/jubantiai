import { User } from '../entities/user.entity';

export interface JWTPayload {
    id: number;
    role: 'teacher' | 'student';
}

declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}

// This is important - without it, the file is treated as a script instead of a module
export {}; 