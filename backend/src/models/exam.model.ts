import { AppDataSource } from '../configs/data-sources';
import { Exam } from '../entities/exam.entity';
import { ICreateExamDto, IUpdateExamDto } from '../interfaces/exam.interface';
import fs from 'fs';
import path from 'path';

export class ExamModel {
    private examRepository = AppDataSource.getRepository(Exam);

    async createExam(teacherId: number, examData: ICreateExamDto, subjectFile: Express.Multer.File): Promise<Exam> {
        const subjectPath = subjectFile.path;

        const newExam = this.examRepository.create({
            ...examData,
            teacherId,
            subjectPath
        });

        return this.examRepository.save(newExam);
    }

    async findExamById(examId: number): Promise<Exam | null> {
        return this.examRepository.findOne({
            where: { id: examId },
            relations: ['teacher']
        });
    }

    async findExamsByTeacher(teacherId: number): Promise<Exam[]> {
        return this.examRepository.find({
            where: { teacherId },
            order: { createdAt: 'DESC' }
        });
    }

    async findPublishedExams(): Promise<Exam[]> {
        return this.examRepository.find({
            where: { status: 'published' },
            order: { createdAt: 'DESC' },
            relations: ['teacher']
        });
    }

    async updateExam(examId: number, updateData: IUpdateExamDto): Promise<Exam | null> {
        await this.examRepository.update(examId, updateData);
        return this.findExamById(examId);
    }

    async deleteExam(examId: number): Promise<boolean> {
        const exam = await this.findExamById(examId);
        
        if (!exam) {
            return false;
        }

        // Delete the subject file
        if (exam.subjectPath && fs.existsSync(exam.subjectPath)) {
            fs.unlinkSync(exam.subjectPath);
        }

        // Delete the correction template if it exists
        if (exam.correctionTemplatePath && fs.existsSync(exam.correctionTemplatePath)) {
            fs.unlinkSync(exam.correctionTemplatePath);
        }

        await this.examRepository.delete(examId);
        return true;
    }

    async updateCorrectionTemplate(examId: number, templateFile: Express.Multer.File): Promise<Exam | null> {
        const exam = await this.findExamById(examId);
        
        if (!exam) {
            return null;
        }

        // Delete old template if it exists
        if (exam.correctionTemplatePath && fs.existsSync(exam.correctionTemplatePath)) {
            fs.unlinkSync(exam.correctionTemplatePath);
        }

        // Update with new template
        const updatedExam = await this.examRepository.update(examId, {
            correctionTemplatePath: templateFile.path
        });

        return this.findExamById(examId);
    }

    async getExamSubmissionsCount(examId: number): Promise<number> {
        const exam = await this.examRepository.findOne({
            where: { id: examId },
            relations: ['submissions']
        });
        
        return exam ? exam.submissions.length : 0;
    }

    async generateAutomaticCorrection(examId: number): Promise<string | null> {
        const exam = await this.findExamById(examId);
        
        if (!exam || !exam.subjectPath || !fs.existsSync(exam.subjectPath)) {
            return null;
        }

        // This would call the DeepSeek model via Ollama to generate correction
        // This is a placeholder implementation
        // In a real implementation, this would integrate with the AI model
        
        const subjectContent = fs.readFileSync(exam.subjectPath, 'utf-8');
        
        // Generate a placeholder correction template
        const correctionTemplate = `This is an automatically generated correction template for the exam: ${exam.title}`;
        
        const templatePath = path.join(
            path.dirname(exam.subjectPath), 
            `correction_template_${examId}.pdf`
        );
        
        fs.writeFileSync(templatePath, correctionTemplate);
        
        // Update the exam with the template path
        await this.examRepository.update(examId, {
            correctionTemplatePath: templatePath
        });
        
        return templatePath;
    }
}