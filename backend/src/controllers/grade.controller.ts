import { Request, Response } from 'express';
import { GradeService } from '../services/grade.service';
import { ICreateGradeDto, IUpdateGradeDto } from '../interfaces/grade.interface';
import { AppError } from '../utils/app-error';
import { isAppError } from '../utils/app-error';

export class GradeController {
    private gradeService: GradeService;

    constructor() {
        this.gradeService = new GradeService();
    }

    createGrade = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }

            const gradeData: ICreateGradeDto = req.body;
            const newGrade = await this.gradeService.createGrade(gradeData);
            res.status(201).json({
                success: true,
                message: 'Grade created successfully',
                data: newGrade
            });
        } catch (error: unknown) {
            if (isAppError(error)) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            } else {
                const message = error instanceof Error ? error.message : 'Unknown error';
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: message
                });
            }
        }
    };

    getGradeById = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }

            const gradeId = parseInt(req.params.id);
            const grade = await this.gradeService.getGradeById(gradeId);
            res.status(200).json({
                success: true,
                data: grade
            });
        } catch (error: unknown) {
            if (isAppError(error)) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            } else {
                const message = error instanceof Error ? error.message : 'Unknown error';
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: message
                });
            }
        }
    };

    getGradesBySubmissionId = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }

            const submissionId = parseInt(req.params.submissionId);
            const grades = await this.gradeService.getGradesBySubmissionId(submissionId);
            res.status(200).json({
                success: true,
                data: grades
            });
        } catch (error: unknown) {
            if (isAppError(error)) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            } else {
                const message = error instanceof Error ? error.message : 'Unknown error';
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: message
                });
            }
        }
    };

    getGradesByExamId = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }

            const examId = parseInt(req.params.examId);
            const grades = await this.gradeService.getGradesByExamId(examId);
            res.status(200).json({
                success: true,
                data: grades
            });
        } catch (error: unknown) {
            if (isAppError(error)) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            } else {
                const message = error instanceof Error ? error.message : 'Unknown error';
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: message
                });
            }
        }
    };

    updateGrade = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }

            const gradeId = parseInt(req.params.id);
            const userId = req.user.id;
            const gradeData: IUpdateGradeDto = req.body;
            
            const updatedGrade = await this.gradeService.updateGrade(gradeId, gradeData, userId);
            res.status(200).json({
                success: true,
                message: 'Grade updated successfully',
                data: updatedGrade
            });
        } catch (error: unknown) {
            if (isAppError(error)) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            } else {
                const message = error instanceof Error ? error.message : 'Unknown error';
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: message
                });
            }
        }
    };

    validateGrade = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }

            const gradeId = parseInt(req.params.id);
            const teacherId = req.user.id; // From auth middleware
            
            const result = await this.gradeService.validateGrade(gradeId, teacherId);
            
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.grade
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message,
                    data: result.grade
                });
            }
        } catch (error: unknown) {
            if (isAppError(error)) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            } else {
                const message = error instanceof Error ? error.message : 'Unknown error';
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: message
                });
            }
        }
    };

    generateAIGrade = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }

            const submissionId = parseInt(req.params.submissionId);
            
            // Check if user is a teacher (from auth middleware)
            if (req.user.role !== 'teacher') {
                res.status(403).json({
                    success: false,
                    message: 'Unauthorized: Only teachers can generate AI grades'
                });
                return;
            }
            
            const aiGrade = await this.gradeService.generateAIGrade(submissionId);
            res.status(201).json({
                success: true,
                message: 'AI grade generated successfully',
                data: aiGrade
            });
        } catch (error: unknown) {
            if (isAppError(error)) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            } else {
                const message = error instanceof Error ? error.message : 'Unknown error';
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: message
                });
            }
        }
    };

    getExamStatistics = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }

            const examId = parseInt(req.params.examId);
            const statistics = await this.gradeService.getExamStatistics(examId);
            res.status(200).json({
                success: true,
                data: statistics
            });
        } catch (error: unknown) {
            if (isAppError(error)) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            } else {
                const message = error instanceof Error ? error.message : 'Unknown error';
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: message
                });
            }
        }
    };

    getStudentGrades = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
                return;
            }

            // Utiliser directement l'ID de l'utilisateur authentifié
            const studentId = req.user.id;
            
            const grades = await this.gradeService.getStudentGrades(studentId);
            res.status(200).json({
                success: true,
                data: grades
            });
        } catch (error: unknown) {
            if (isAppError(error)) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            } else {
                const message = error instanceof Error ? error.message : 'Unknown error';
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: message
                });
            }
        }
    };
}