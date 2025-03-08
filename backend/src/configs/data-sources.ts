import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../entities/user.entity';
import { Exam } from '../entities/exam.entity';
import { Submission } from '../entities/submission.entity';
import { Grade } from '../entities/grade.entity';
import { PlagiarismReport } from '../entities/plagiarism-report.entity';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jubantiai_db'
};

console.log('Database configuration:', dbConfig);

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: dbConfig.host,
    port: parseInt(dbConfig.port),
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    synchronize: true, // Be careful with this in production
    logging: true,
    entities: [
        User,
        Exam,
        Submission,
        Grade,
        PlagiarismReport
    ],
    subscribers: [],
    migrations: [],
});