import { User } from '../entities/user.entity';

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}

// This is important - without it, the file is treated as a script instead of a module
export {}; 