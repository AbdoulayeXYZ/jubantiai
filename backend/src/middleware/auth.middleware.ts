import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../entities/user.entity';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT || 'your-secret-key') as any;
        
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({ where: { id: decoded.id } });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Set the user object on the request
        req.user = user;
        
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}; 