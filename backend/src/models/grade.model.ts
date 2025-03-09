import { Repository } from 'typeorm';
import { AppDataSource } from '../configs/data-sources';
import { Grade } from '../entities/grade.entity';
import { ICreateGradeDto, IUpdateGradeDto, IGradeSummary } from '../interfaces/grade.interface';
import { Model, DataTypes } from 'sequelize';
import sequelize from '../configs/database.config';

interface GradeAttributes {
    id: number;
    submissionId: number;
    grade: number;
    feedback: string;
    justification: string;
    // Add other attributes as needed
}

class SequelizeGradeModel extends Model<GradeAttributes> {
    // Add static methods
    static findBySubmissionId(submissionId: number) {
        return this.findAll({
            where: { submissionId }
        });
    }
}

SequelizeGradeModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    submissionId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    grade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    feedback: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    justification: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Grade'
});

export { SequelizeGradeModel };

export class GradeModel {
    private repository = AppDataSource.getRepository(Grade);

    async createGrade(gradeData: ICreateGradeDto): Promise<Grade> {
        const grade = this.repository.create(gradeData);
        return this.repository.save(grade);
    }

    async getGradeById(id: number): Promise<Grade | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['submission', 'submission.exam']
        });
    }

    async getGradesBySubmissionId(submissionId: number): Promise<Grade[]> {
        return this.repository.find({
            where: { submissionId },
            relations: ['submission']
        });
    }

    async getGradesByExamId(examId: number): Promise<Grade[]> {
        return this.repository.createQueryBuilder('grade')
            .leftJoinAndSelect('grade.submission', 'submission')
            .where('submission.examId = :examId', { examId })
            .getMany();
    }

    async updateGrade(id: number, gradeData: IUpdateGradeDto): Promise<Grade | null> {
        await this.repository.update(id, gradeData);
        return this.getGradeById(id);
    }

    async validateGrade(id: number, teacherId: number): Promise<Grade | null> {
        await this.repository.update(id, { 
            isValidated: true, 
            validatedBy: teacherId 
        });
        return this.getGradeById(id);
    }

    async calculateGradeStatistics(examId: number): Promise<IGradeSummary> {
        const result = await this.repository
            .createQueryBuilder('grade')
            .leftJoin('grade.submission', 'submission')
            .where('submission.examId = :examId', { examId })
            .select([
                'AVG(grade.score) as averageGrade',
                'MAX(grade.score) as highestGrade',
                'MIN(grade.score) as lowestGrade',
                'COUNT(grade.id) as totalGrades'
            ])
            .getRawOne();

        return {
            average: result.averageGrade ? Number(result.averageGrade.toFixed(2)) : 0,
            highest: result.highestGrade || 0,
            lowest: result.lowestGrade || 0,
            median: 0, // TODO: Implement median calculation
            distribution: [] // TODO: Implement grade distribution calculation
        };
    }

    async getStudentGrades(studentId: number): Promise<Grade[]> {
        console.log('Getting grades for student ID:', studentId); // Debug log

        if (!studentId || isNaN(studentId)) {
            throw new Error(`Invalid student ID: ${studentId}`);
        }

        try {
            const grades = await this.repository
                .createQueryBuilder('grade')
                .innerJoin('grade.submission', 'submission')
                .innerJoin('submission.exam', 'exam')
                .where('submission.studentId = :studentId', { 
                    studentId: parseInt(studentId.toString()) 
                })
                .getMany();

            console.log('Found grades:', grades); // Debug log
            return grades;
        } catch (error) {
            console.error('Error in getStudentGrades:', error);
            throw error;
        }
    }

    async findBySubmissionId(submissionId: number): Promise<Grade[]> {
        return this.repository.find({
            where: { submissionId },
            relations: ['submission']
        });
    }

    async create(gradeData: ICreateGradeDto): Promise<Grade> {
        const grade = this.repository.create(gradeData);
        return this.repository.save(grade);
    }
}