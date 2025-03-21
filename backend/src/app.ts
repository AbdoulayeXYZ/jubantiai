import 'reflect-metadata';
import { AppDataSource } from './configs/data-sources';
import express from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './routes/user.route';
import examRoutes from './routes/exam.route';
import submissionRoutes from './routes/submission.route';
import gradeRoutes from './routes/grade.route';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';

// Configuration de l'environnement
dotenv.config();

// Initialisation Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de base
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration CORS
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

// Initialize database connection and start server
const startServer = async () => {
  try {
    // Initialize database connection first
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    // Only set up routes after database is connected
    app.get('/', (req: Request, res: Response) => {
        res.send('Hello from Express server!');
    });

    // Routes
    app.use('/api/users', userRoutes);
    app.use('/api/exams', examRoutes);
    app.use('/api/submissions', submissionRoutes);
    // Add additional route for exam submissions to match frontend pattern
    app.use('/api/exams', submissionRoutes);
    app.use('/api/grades', gradeRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/chat', chatRoutes);

    // Then start Express server
    app.listen(PORT, () => {
      console.log(`Express server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
};

startServer();

export default app;