import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../entities/user.entity';
import { Exam } from '../entities/exam.entity';
import { Submission } from '../entities/submission.entity';
import { Grade } from '../entities/grade.entity';
import { PlagiarismReport } from '../entities/plagiarism-report.entity';
import { UpdateValidatedByColumn1709999999999 } from '../migrations/1709999999999-UpdateValidatedByColumn';

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
    synchronize: false, // Disable synchronize when using migrations
    logging: true,
    entities: [
        User,
        Exam,
        Submission,
        Grade,
        PlagiarismReport
    ],
    subscribers: [],
    migrations: [UpdateValidatedByColumn1709999999999],
});