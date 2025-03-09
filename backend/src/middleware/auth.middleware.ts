import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../configs/data-sources';
import { User } from '../entities/user.entity';
import { JWTPayload } from '../types/express';

declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}

const JWT_KEY = process.env.JWT || 'd8aed9552142ea44931ca36311ebf1c7d2e08113fdb4226d8c4d1075b5177f8d';

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, JWT_KEY) as { id: number; role: string };
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({ where: { id: decoded.id } });
            
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            
            req.user = {
                id: user.id,
                role: user.role
            };
            next();
        } catch (error) {
            console.log('Token verification error:', error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

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

        try {
            const decoded = jwt.verify(token, process.env.JWT || '') as JWTPayload;
            
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({ where: { id: decoded.id } });

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Set the user object on the request
            req.user = {
                id: user.id,
                role: user.role
            };
            
            next();
        } catch (jwtError) {
            console.error('JWT verification failed:', jwtError);
            return res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}; 