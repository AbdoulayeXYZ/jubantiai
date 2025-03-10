import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';

export const teacherMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    if (req.user.role !== 'teacher') {
        return res.status(403).json({
            success: false,
            message: 'Access denied: Teacher privileges required'
        });
    }

    next();
}; 