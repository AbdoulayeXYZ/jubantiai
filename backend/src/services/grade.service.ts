import { GradeModel } from '../models/grade.model';
import { SubmissionModel } from '../models/submission.model';
import { ExamModel } from '../models/exam.model';
import { NotificationService } from './notification.service';
import { OllamaService } from './ollama.service';
import { ICreateGradeDto, IUpdateGradeDto, IGradeValidationResult, IGradeSummary } from '../interfaces/grade.interface';
import { Grade } from '../entities/grade.entity';
import { AppError } from '../utils/app-error';

export class GradeService {
    private gradeModel: GradeModel;
    private submissionModel: SubmissionModel;
    private examModel: ExamModel;
    private notificationService: NotificationService;
    private ollamaService: OllamaService;

    constructor() {
        this.gradeModel = new GradeModel();
        this.submissionModel = new SubmissionModel();
        this.examModel = new ExamModel();
        this.notificationService = new NotificationService();
        this.ollamaService = new OllamaService();
    }

    async createGrade(gradeData: ICreateGradeDto): Promise<Grade> {
        // Verify submission exists
        const submission = await this.submissionModel.getSubmissionById(gradeData.submissionId);
        if (!submission) {
            throw new AppError('Submission not found', 404);
        }

        // Create grade
        const newGrade = await this.gradeModel.createGrade(gradeData);

        // Send notification to student
        await this.notificationService.sendNotification({
            userId: submission.studentId,
            title: 'New grade available',
            message: `Your submission for ${submission.exam.title} has been graded.`,
            type: 'grade',
            referenceId: newGrade.id
        });

        return newGrade;
    }

    async getGradeById(id: number): Promise<Grade> {
        const grade = await this.gradeModel.getGradeById(id);
        if (!grade) {
            throw new AppError('Grade not found', 404);
        }
        return grade;
    }

    async getGradesBySubmissionId(submissionId: number): Promise<Grade[]> {
        return await this.gradeModel.getGradesBySubmissionId(submissionId);
    }

    async getGradesByExamId(examId: number): Promise<Grade[]> {
        const exam = await this.examModel.getExamById(examId);
        if (!exam) {
            throw new AppError('Exam not found', 404);
        }
        return await this.gradeModel.getGradesByExamId(examId);
    }

    async updateGrade(id: number, gradeData: IUpdateGradeDto, userId: number): Promise<Grade> {
        const grade = await this.getGradeById(id);
        
        // Get the submission to check permissions
        const submission = await this.submissionModel.getSubmissionById(grade.submissionId);
        if (!submission) {
            throw new AppError('Submission not found', 404);
        }

        const exam = await this.examModel.getExamById(submission.examId);
        if (!exam) {
            throw new AppError('Exam not found', 404);
        }
        
        // Verify user is the teacher of this exam
        if (exam.teacherId !== userId) {
            throw new AppError('Unauthorized: Only the teacher who created the exam can update grades', 403);
        }
        
        const updatedGrade = await this.gradeModel.updateGrade(id, gradeData);
        if (!updatedGrade) {
            throw new AppError('Failed to update grade', 500);
        }
        
        // Send notification to student about updated grade
        await this.notificationService.sendNotification({
            userId: submission.studentId,
            title: 'Grade updated',
            message: `Your grade for ${exam.title} has been updated.`,
            type: 'grade_update',
            referenceId: updatedGrade.id
        });
        
        return updatedGrade;
    }

    async validateGrade(id: number, teacherId: number): Promise<IGradeValidationResult> {
        const grade = await this.getGradeById(id);
        
        // Get the submission to check permissions
        const submission = await this.submissionModel.getSubmissionById(grade.submissionId);
        if (!submission) {
            throw new AppError('Submission not found', 404);
        }

        const exam = await this.examModel.getExamById(submission.examId);
        if (!exam) {
            throw new AppError('Exam not found', 404);
        }
        
        // Verify user is the teacher of this exam
        if (exam.teacherId !== teacherId) {
            return {
                success: false,
                message: 'Unauthorized: Only the teacher who created the exam can validate grades'
            };
        }
        
        // If already validated, return error
        if (grade.isValidated) {
            return {
                success: false,
                message: 'Grade already validated',
                grade
            };
        }
        
        const validatedGrade = await this.gradeModel.validateGrade(id, teacherId);
        if (!validatedGrade) {
            return {
                success: false,
                message: 'Failed to validate grade'
            };
        }
        
        // Send notification to student about validated grade
        await this.notificationService.sendNotification({
            userId: submission.studentId,
            title: 'Grade validated',
            message: `Your grade for ${exam.title} has been validated by your teacher.`,
            type: 'grade_validated',
            referenceId: validatedGrade.id
        });
        
        return {
            success: true,
            message: 'Grade successfully validated',
            grade: validatedGrade
        };
    }

    async generateAIGrade(submissionId: number): Promise<Grade> {
        const submission = await this.submissionModel.getSubmissionById(submissionId);
        if (!submission) {
            throw new AppError('Submission not found', 404);
        }
        
        const exam = await this.examModel.getExamById(submission.examId);
        if (!exam) {
            throw new AppError('Exam not found', 404);
        }
        
        // Get correction template (or generate one if not available)
        let correctionTemplate = exam.correctionTemplatePath;
        if (!correctionTemplate) {
            correctionTemplate = await this.ollamaService.generateCorrectionTemplate(exam.subjectPath);
            // Save the generated template
            await this.examModel.updateExam(exam.id, { correctionTemplatePath: correctionTemplate });
        }
        
        try {
            // Use AI to grade the submission
            const aiGradingResult = await this.ollamaService.gradeSubmission(
                submission.filePath,
                correctionTemplate,
                submission.filePath
            );
            
            // Create the grade
            const gradeData: ICreateGradeDto = {
                score: aiGradingResult.grade,
                comment: aiGradingResult.feedback,
                submissionId: submission.id,
                isAutoGenerated: true,
                aiJustification: aiGradingResult.justification
            };
            
            return await this.createGrade(gradeData);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new AppError(`AI grading failed: ${message}`, 500);
        }
    }

    async getExamStatistics(examId: number): Promise<IGradeSummary> {
        const exam = await this.examModel.getExamById(examId);
        if (!exam) {
            throw new AppError('Exam not found', 404);
        }
        
        return await this.gradeModel.calculateGradeStatistics(examId);
    }

    async getStudentGrades(studentId: number): Promise<Grade[]> {
        return await this.gradeModel.getStudentGrades(studentId);
    }
}