import { ExamModel } from '../models/exam.model';
import { ICreateExamDto, IUpdateExamDto, IExamWithSubmissionsCount } from '../interfaces/exam.interface';
import { NotificationService } from '../notification/notification.service';
import { OllamaService } from '../ai/ollama.service';
import { Exam } from '../entities/exam.entity';
import fs from 'fs';

export class ExamService {
    private examModel: ExamModel;
    private notificationService: NotificationService;
    private ollamaService: OllamaService;

    constructor() {
        this.examModel = new ExamModel();
        this.notificationService = new NotificationService();
        this.ollamaService = new OllamaService();
    }

    async createExam(teacherId: number, examData: ICreateExamDto, subjectFile: Express.Multer.File): Promise<Exam> {
        const exam = await this.examModel.createExam(teacherId, examData, subjectFile);
        
        // If exam is published, notify students
        if (exam.status === 'published') {
            await this.notificationService.notifyNewExam(exam);
        }
        
        return exam;
    }

    async getExamById(examId: number): Promise<Exam | null> {
        return this.examModel.findExamById(examId);
    }

    async getExamsByTeacher(teacherId: number): Promise<IExamWithSubmissionsCount[]> {
        const exams = await this.examModel.findExamsByTeacher(teacherId);
        
        // Get submission counts for each exam
        const examsWithCounts = await Promise.all(
            exams.map(async exam => {
                const submissionsCount = await this.examModel.getExamSubmissionsCount(exam.id);
                return {
                    ...exam,
                    submissionsCount
                };
            })
        );
        
        return examsWithCounts;
    }

    async getPublishedExams(): Promise<Exam[]> {
        return this.examModel.findPublishedExams();
    }

    async updateExam(examId: number, teacherId: number, updateData: IUpdateExamDto): Promise<Exam | null> {
        // Verify teacher owns this exam
        const exam = await this.examModel.findExamById(examId);
        
        if (!exam || exam.teacherId !== teacherId) {
            return null;
        }
        
        const updatedExam = await this.examModel.updateExam(examId, updateData);
        
        // If status changed to published, notify students
        if (updateData.status === 'published' && exam.status !== 'published') {
            await this.notificationService.notifyNewExam(updatedExam!);
        }
        
        return updatedExam;
    }

    async deleteExam(examId: number, teacherId: number): Promise<boolean> {
        // Verify teacher owns this exam
        const exam = await this.examModel.findExamById(examId);
        
        if (!exam || exam.teacherId !== teacherId) {
            return false;
        }
        
        return this.examModel.deleteExam(examId);
    }

    async generateCorrectionTemplate(examId: number, teacherId: number): Promise<string | null> {
        // Verify teacher owns this exam
        const exam = await this.examModel.findExamById(examId);
        
        if (!exam || exam.teacherId !== teacherId) {
            return null;
        }
        
        if (!exam.subjectPath || !fs.existsSync(exam.subjectPath)) {
            throw new Error("Subject file not found");
        }
        
        // Use DeepSeek via Ollama to generate a correction template
        try {
            const subjectContent = fs.readFileSync(exam.subjectPath, 'utf8');
            const templateContent = await this.ollamaService.generateCorrectionTemplate(subjectContent, exam.title);
            
            // Save the template
            const templatePath = exam.subjectPath.replace('.pdf', '_correction_template.pdf');
            fs.writeFileSync(templatePath, templateContent);
            
            // Update the exam with the template path
            await this.examModel.updateExam(examId, { correctionTemplatePath: templatePath });
            
            return templatePath;
        } catch (error) {
            console.error('Error generating correction template:', error);
            return null;
        }
    }

    async getExamSubject(examId: number): Promise<{ path: string; filename: string } | null> {
        const exam = await this.examModel.findExamById(examId);
        
        if (!exam || !exam.subjectPath || !fs.existsSync(exam.subjectPath)) {
            return null;
        }
        
        return {
            path: exam.subjectPath,
            filename: `${exam.title}_subject.pdf`
        };
    }

    async getCorrectionTemplate(examId: number, teacherId: number): Promise<{ path: string; filename: string } | null> {
        const exam = await this.examModel.findExamById(examId);
        
        if (!exam || exam.teacherId !== teacherId || !exam.correctionTemplatePath || !fs.existsSync(exam.correctionTemplatePath)) {
            return null;
        }
        
        return {
            path: exam.correctionTemplatePath,
            filename: `${exam.title}_correction_template.pdf`
        };
    }
}