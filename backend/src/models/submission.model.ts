import { AppDataSource } from '../configs/data-sources';
import { Submission } from '../entities/submission.entity';
import { Exam } from '../entities/exam.entity';
import { Grade } from '../entities/grade.entity';
import { User } from '../entities/user.entity';
import { ICreateSubmissionDto, IUpdateSubmissionDto, ISubmissionFilters, ISubmissionStats } from '../interfaces/submission.interface';
import * as fs from 'fs';
import * as path from 'path';

export class SubmissionModel {
    private repository = AppDataSource.getRepository(Submission);
    private examRepository = AppDataSource.getRepository(Exam);
    private userRepository = AppDataSource.getRepository(User);
    private gradeRepository = AppDataSource.getRepository(Grade);

    async create(createSubmissionDto: ICreateSubmissionDto & { filePath: string }): Promise<Submission> {
        const exam = await this.examRepository.findOne({ where: { id: createSubmissionDto.examId } });
        if (!exam) {
            throw new Error('Exam not found');
        }

        // Check if submission is late based on exam deadline
        let isLate = false;
        if (exam.deadline && new Date() > exam.deadline) {
            isLate = true;
        }

        const newSubmission = this.repository.create({
            ...createSubmissionDto,
            isLate,
            status: 'submitted'
        });

        return this.repository.save(newSubmission);
    }

    async findAll(filters?: ISubmissionFilters): Promise<Submission[]> {
        const queryBuilder = this.repository.createQueryBuilder('submission')
            .leftJoinAndSelect('submission.student', 'student')
            .leftJoinAndSelect('submission.exam', 'exam')
            .leftJoinAndSelect('submission.grades', 'grades');

        if (filters) {
            if (filters.examId) {
                queryBuilder.andWhere('submission.examId = :examId', { examId: filters.examId });
            }
            if (filters.studentId) {
                queryBuilder.andWhere('submission.studentId = :studentId', { studentId: filters.studentId });
            }
            if (filters.status) {
                queryBuilder.andWhere('submission.status = :status', { status: filters.status });
            }
            if (filters.isLate !== undefined) {
                queryBuilder.andWhere('submission.isLate = :isLate', { isLate: filters.isLate });
            }
        }

        return queryBuilder.getMany();
    }

    async findById(id: number): Promise<Submission | null> {
        return this.repository.findOne({ 
            where: { id },
            relations: ['student', 'exam', 'grades', 'plagiarismReports']
        });
    }

    async findByStudentAndExam(studentId: number, examId: number): Promise<Submission | null> {
        return this.repository.findOne({
            where: { studentId, examId }
        });
    }

    async update(id: number, updateSubmissionDto: IUpdateSubmissionDto): Promise<Submission | null> {
        const submission = await this.findById(id);
        if (!submission) {
            return null;
        }

        Object.assign(submission, updateSubmissionDto);
        return this.repository.save(submission);
    }

    async delete(id: number): Promise<boolean> {
        const submission = await this.findById(id);
        if (!submission) {
            return false;
        }

        // Delete the file
        try {
            if (submission.filePath && fs.existsSync(submission.filePath)) {
                fs.unlinkSync(submission.filePath);
            }
        } catch (error) {
            console.error('Error deleting submission file:', error);
        }

        await this.repository.remove(submission);
        return true;
    }

    async getSubmissionStats(examId: number): Promise<ISubmissionStats> {
        const stats: ISubmissionStats = {
            totalSubmissions: 0,
            pendingCount: 0,
            submittedCount: 0,
            gradedCount: 0,
            lateSubmissionsCount: 0
        };

        // Get total count by status
        const statusCounts = await this.repository
            .createQueryBuilder('submission')
            .select('submission.status', 'status')
            .addSelect('COUNT(submission.id)', 'count')
            .where('submission.examId = :examId', { examId })
            .groupBy('submission.status')
            .getRawMany();

        statusCounts.forEach(item => {
            stats.totalSubmissions += parseInt(item.count);
            switch (item.status) {
                case 'pending':
                    stats.pendingCount = parseInt(item.count);
                    break;
                case 'submitted':
                    stats.submittedCount = parseInt(item.count);
                    break;
                case 'graded':
                    stats.gradedCount = parseInt(item.count);
                    break;
            }
        });

        // Get late submissions count
        const lateSubmissions = await this.repository
            .createQueryBuilder('submission')
            .where('submission.examId = :examId', { examId })
            .andWhere('submission.isLate = :isLate', { isLate: true })
            .getCount();

        stats.lateSubmissionsCount = lateSubmissions;

        // Calculate average grade if there are graded submissions
        if (stats.gradedCount > 0) {
            const gradeResult = await this.gradeRepository
                .createQueryBuilder('grade')
                .innerJoin('grade.submission', 'submission')
                .select('AVG(grade.value)', 'average')
                .where('submission.examId = :examId', { examId })
                .andWhere('submission.status = :status', { status: 'graded' })
                .getRawOne();

            if (gradeResult && gradeResult.average) {
                stats.averageGrade = Number(parseFloat(gradeResult.average).toFixed(2));
            }
        }

        return stats;
    }

    async getSubmissionById(id: number): Promise<Submission | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['student', 'exam', 'grades']
        });
    }
}