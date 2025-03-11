import { ExamModel } from '../models/exam.model';
import { ICreateExamDto, IUpdateExamDto, IExamWithSubmissionsCount } from '../interfaces/exam.interface';
import { NotificationService } from '../notification/notification.service';
import { OllamaService } from './ollama.service';
import { Exam } from '../entities/exam.entity';
import fs from 'fs';
import path from 'path';

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
        // Vérifier que l'enseignant possède cet examen
        const exam = await this.examModel.findExamById(examId);
        
        if (!exam || exam.teacherId !== teacherId) {
            return null;
        }

        try {
            // Créer un fichier de template avec les critères d'évaluation
            const template = {
                criteria: {
                    understanding: {
                        description: "Évaluation de la compréhension des concepts clés",
                        maxScore: 8,
                        criteria: [
                            "Identification des concepts principaux",
                            "Application correcte des théories",
                            "Liens entre les concepts"
                        ]
                    },
                    methodology: {
                        description: "Évaluation de la méthodologie et de l'approche",
                        maxScore: 6,
                        criteria: [
                            "Structure logique de la réponse",
                            "Utilisation d'exemples pertinents",
                            "Argumentation claire"
                        ]
                    },
                    structure: {
                        description: "Évaluation de la présentation et organisation",
                        maxScore: 4,
                        criteria: [
                            "Clarté de l'expression",
                            "Organisation des idées",
                            "Qualité de la rédaction"
                        ]
                    },
                    additional: {
                        description: "Points supplémentaires pour l'originalité",
                        maxScore: 2,
                        criteria: [
                            "Perspectives originales",
                            "Exemples innovants",
                            "Réflexion approfondie"
                        ]
                    }
                },
                totalScore: 20,
                examInfo: {
                    id: exam.id,
                    title: exam.title,
                    generatedAt: new Date().toISOString()
                }
            };
            
            // Sauvegarder le template
            const templatePath = path.join(
                path.dirname(exam.subjectPath), 
                `correction_template_${examId}.json`
            );
            
            fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));
            
            // Mettre à jour l'examen avec le chemin du template
            await this.examModel.updateExam(examId, { correctionTemplatePath: templatePath });
            
            return templatePath;
        } catch (error) {
            console.error('Error saving correction template:', error);
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

    async updateCorrectionTemplate(examId: number, teacherId: number, templateFile: Express.Multer.File): Promise<Exam | null> {
        const exam = await this.examModel.findExamById(examId);
        
        if (!exam || exam.teacherId !== teacherId) {
            return null;
        }

        return this.examModel.updateCorrectionTemplate(examId, templateFile);
    }
}