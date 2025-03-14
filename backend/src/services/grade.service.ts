import { GradeModel } from '../models/grade.model';
import { SubmissionModel } from '../models/submission.model';
import { ExamModel } from '../models/exam.model';
import { NotificationService } from './notification.service';
import { OllamaService } from './ollama.service';
import { ICreateGradeDto, IUpdateGradeDto, IGradeValidationResult, IGradeSummary } from '../interfaces/grade.interface';
import { Grade } from '../entities/grade.entity';
import { Submission } from '../entities/submission.entity';
import { AppError } from '../utils/app-error';
import * as fs from 'fs/promises';
import * as path from 'path';
import pdfParse from 'pdf-parse';

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

    private async readPDFContent(filePath: string): Promise<string> {
        console.log(`Attempting to read PDF from path: ${filePath}`);
        
        try {
            // Vérifier si le fichier existe
            try {
                await fs.access(filePath);
            } catch (error) {
                console.error(`File does not exist at path: ${filePath}`);
                throw new AppError(`File not found at path: ${filePath}`, 404);
            }

            // Lire le fichier
            console.log('Reading file buffer...');
            const dataBuffer = await fs.readFile(filePath);
            console.log(`File buffer read successfully, size: ${dataBuffer.length} bytes`);

            // Parser le PDF
            console.log('Parsing PDF content...');
            const data = await pdfParse(dataBuffer);
            console.log(`PDF parsed successfully, extracted text length: ${data.text.length} characters`);

            return data.text;
        } catch (error: unknown) {
            console.error('Error reading PDF:', error);
            if (error instanceof AppError) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            throw new AppError(`Failed to read PDF content: ${errorMessage}`, 500);
        }
    }

    private async saveTemplateToFile(examId: number, template: string): Promise<string> {
        const templateDir = path.join(__dirname, '../../uploads/templates');
        await fs.mkdir(templateDir, { recursive: true });
        
        const templatePath = path.join(templateDir, `template_${examId}_${Date.now()}.txt`);
        await fs.writeFile(templatePath, template, 'utf8');
        
        return templatePath;
    }

    async generateAIGrade(submissionId: number): Promise<Grade> {
        console.log(`Starting AI grade generation for submission ID: ${submissionId}`);
    
        const submission = await this.submissionModel.findById(submissionId);
        if (!submission) {
            throw new Error('Submission not found');
        }
    
        const exam = await this.examModel.findById(submission.examId);
        if (!exam) {
            throw new Error('Exam not found');
        }
    
        try {
            console.log('Reading student submission...');
            const submissionContent = await this.readPDFContent(submission.filePath);
            
            console.log('Generating AI grade...');
            const aiGradingResult = await this.ollamaService.gradeSubmission(
                submissionContent,
                exam.title
            );
            
            console.log(`AI grading result: ${JSON.stringify(aiGradingResult)}`);
            
            const gradeData: ICreateGradeDto = {
                score: aiGradingResult.grade,
                comment: aiGradingResult.feedback,
                submissionId: submission.id,
                isAutoGenerated: true,
                aiJustification: aiGradingResult.justification
            };
    
            const grade = await this.gradeModel.create(gradeData);
    
            await this.submissionModel.update(submissionId, {
                status: 'graded',
                feedback: aiGradingResult.feedback
            });
    
            return grade;
        } catch (error) {
            console.error('Error in AI grade generation:', error);
            throw new Error('Failed to generate AI grade');
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

    // async checkPlagiarism(submissionId: number): Promise<number[]> {
    //     const submission = await this.submissionModel.getSubmissionById(submissionId);
    //     if (!submission) {
    //         throw new AppError('Submission not found', 404);
    //     }

    //     const exam = await this.examModel.getExamById(submission.examId);
    //     if (!exam) {
    //         throw new AppError('Exam not found', 404);
    //     }

    //     // Get all submissions for this exam except the current one
    //     const allSubmissions = await this.submissionModel.getSubmissionsByExamId(exam.id);
    //     const otherSubmissions = allSubmissions.filter((s: Submission) => s.id !== submissionId);

    //     const submissionContent = await this.readPDFContent(submission.filePath);
    //     const similarityResults: number[] = [];

    //     // Compare with each other submission
    //     for (const otherSubmission of otherSubmissions) {
    //         const otherContent = await this.readPDFContent(otherSubmission.filePath);
    //         const similarity = await this.ollamaService.compareSubmissions(submissionContent, otherContent);
    //         similarityResults.push(similarity);
    //     }

    //     return similarityResults;
    // }
}