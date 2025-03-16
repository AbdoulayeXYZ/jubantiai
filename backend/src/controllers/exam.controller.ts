/// <reference path="../types/express.d.ts" />

import { Request, Response } from 'express';
import { ExamService } from '../services/exam.service';
import { ICreateExamDto, IUpdateExamDto } from '../interfaces/exam.interface';
import path from 'path';

export class ExamController {
    private examService: ExamService;

    constructor() {
        this.examService = new ExamService();
    }

    createExam = async (req: Request, res: Response): Promise<Response> => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const teacherId = req.user.id;
            
            if (req.user.role !== 'teacher') {
                return res.status(403).json({ message: 'Only teachers can create exams' });
            }
            
            if (!req.file) {
                return res.status(400).json({ message: 'Subject file is required' });
            }
            
            const examData: ICreateExamDto = {
                title: req.body.title,
                description: req.body.description,
                status: req.body.status || 'draft',
                deadline: req.body.deadline ? new Date(req.body.deadline) : undefined
            };
            
            const exam = await this.examService.createExam(teacherId, examData, req.file);
            
            return res.status(201).json(exam);
        } catch (error) {
            console.error('Error creating exam:', error);
            return res.status(500).json({ message: 'Failed to create exam' });
        }
    };

    getExamById = async (req: Request, res: Response): Promise<Response> => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const examId = parseInt(req.params.id);
            
            if (isNaN(examId)) {
                return res.status(400).json({ message: 'Invalid exam ID' });
            }
            
            const exam = await this.examService.getExamById(examId);
            
            if (!exam) {
                return res.status(404).json({ message: 'Exam not found' });
            }
            
            // If student trying to access an unpublished exam
            if (req.user.role === 'student' && exam.status !== 'published') {
                return res.status(403).json({ message: 'Exam not available' });
            }
            
            // If teacher trying to access exam they don't own
            if (req.user.role === 'teacher' && exam.teacherId !== req.user.id) {
                return res.status(403).json({ message: 'Access denied' });
            }
            
            return res.status(200).json(exam);
        } catch (error) {
            console.error('Error getting exam:', error);
            return res.status(500).json({ message: 'Failed to get exam' });
        }
    };

    getExams = async (req: Request, res: Response): Promise<Response> => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            if (req.user.role === 'teacher') {
                const exams = await this.examService.getExamsByTeacher(req.user.id);
                return res.status(200).json(exams);
            } else {
                const exams = await this.examService.getPublishedExams();
                return res.status(200).json(exams);
            }
        } catch (error) {
            console.error('Error getting exams:', error);
            return res.status(500).json({ message: 'Failed to get exams' });
        }
    };

    getExamsByTeacher = async (req: Request, res: Response): Promise<Response> => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const teacherId = parseInt(req.params.teacherId);
            
            if (isNaN(teacherId)) {
                return res.status(400).json({ message: 'Invalid teacher ID' });
            }

            // Verify that the requesting user is the teacher
            if (req.user.role !== 'teacher' || req.user.id !== teacherId) {
                return res.status(403).json({ message: 'Access denied' });
            }
            
            const exams = await this.examService.getExamsByTeacher(teacherId);
            return res.status(200).json(exams);
        } catch (error) {
            console.error('Error getting teacher exams:', error);
            return res.status(500).json({ message: 'Failed to get teacher exams' });
        }
    };

    updateExam = async (req: Request, res: Response): Promise<Response> => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const examId = parseInt(req.params.id);
            
            if (isNaN(examId)) {
                return res.status(400).json({ message: 'Invalid exam ID' });
            }
            
            if (req.user.role !== 'teacher') {
                return res.status(403).json({ message: 'Only teachers can update exams' });
            }
            
            const updateData: IUpdateExamDto = {
                title: req.body.title,
                description: req.body.description,
                status: req.body.status,
                deadline: req.body.deadline ? new Date(req.body.deadline) : undefined
            };
            
            const updatedExam = await this.examService.updateExam(examId, req.user.id, updateData);
            
            if (!updatedExam) {
                return res.status(404).json({ message: 'Exam not found or not authorized' });
            }
            
            return res.status(200).json(updatedExam);
        } catch (error) {
            console.error('Error updating exam:', error);
            return res.status(500).json({ message: 'Failed to update exam' });
        }
    };

    deleteExam = async (req: Request, res: Response): Promise<Response> => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const examId = parseInt(req.params.id);
            
            if (isNaN(examId)) {
                return res.status(400).json({ message: 'Invalid exam ID' });
            }
            
            if (req.user.role !== 'teacher') {
                return res.status(403).json({ message: 'Only teachers can delete exams' });
            }
            
            const success = await this.examService.deleteExam(examId, req.user.id);
            
            if (!success) {
                return res.status(404).json({ message: 'Exam not found or not authorized' });
            }
            
            return res.status(204).send();
        } catch (error) {
            console.error('Error deleting exam:', error);
            return res.status(500).json({ message: 'Failed to delete exam' });
        }
    };

    generateCorrectionTemplate = async (req: Request, res: Response): Promise<Response> => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const examId = parseInt(req.params.id);
            
            if (isNaN(examId)) {
                return res.status(400).json({ message: 'Invalid exam ID' });
            }
            
            if (req.user.role !== 'teacher') {
                return res.status(403).json({ message: 'Only teachers can generate correction templates' });
            }
            
            const templatePath = await this.examService.generateCorrectionTemplate(examId, req.user.id);
            
            if (!templatePath) {
                return res.status(404).json({ message: 'Exam not found or not authorized' });
            }
            
            return res.status(200).json({ 
                message: 'Correction template generated successfully',
                templatePath 
            });
        } catch (error) {
            console.error('Error generating correction template:', error);
            return res.status(500).json({ message: 'Failed to generate correction template' });
        }
    };

    downloadExamSubject = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const examId = parseInt(req.params.id);
            
            if (isNaN(examId)) {
                return res.status(400).json({ message: 'Invalid exam ID' });
            }
            
            const subjectInfo = await this.examService.getExamSubject(examId);
            
            if (!subjectInfo) {
                return res.status(404).json({ message: 'Exam subject not found' });
            }
            
            return res.download(subjectInfo.path, subjectInfo.filename);
        } catch (error) {
            console.error('Error downloading exam subject:', error);
            return res.status(500).json({ message: 'Failed to download exam subject' });
        }
    };

    downloadCorrectionTemplate = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const examId = parseInt(req.params.id);
            
            if (isNaN(examId)) {
                return res.status(400).json({ message: 'Invalid exam ID' });
            }
            
            if (req.user.role !== 'teacher') {
                return res.status(403).json({ message: 'Only teachers can download correction templates' });
            }
            
            const templateInfo = await this.examService.getCorrectionTemplate(examId, req.user.id);
            
            if (!templateInfo) {
                return res.status(404).json({ message: 'Correction template not found' });
            }
            
            return res.download(templateInfo.path, templateInfo.filename);
        } catch (error) {
            console.error('Error downloading correction template:', error);
            return res.status(500).json({ message: 'Failed to download correction template' });
        }
    };

    updateCorrectionTemplate = async (req: Request, res: Response): Promise<Response> => {
        try {
            if (!req.user || req.user.role !== 'teacher') {
                return res.status(403).json({ message: 'Only teachers can update correction templates' });
            }

            if (!req.file) {
                return res.status(400).json({ message: 'Template file is required' });
            }

            const examId = parseInt(req.params.id);
            const updatedExam = await this.examService.updateCorrectionTemplate(examId, req.user.id, req.file);
            
            if (!updatedExam) {
                return res.status(404).json({ message: 'Exam not found or not authorized' });
            }

            return res.status(200).json(updatedExam);
        } catch (error) {
            console.error('Error updating correction template:', error);
            return res.status(500).json({ message: 'Failed to update correction template' });
        }
    };

    updateExamStatus = async (req: Request, res: Response): Promise<Response> => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const examId = parseInt(req.params.id);
            
            if (isNaN(examId)) {
                return res.status(400).json({ message: 'Invalid exam ID' });
            }
            
            if (req.user.role !== 'teacher') {
                return res.status(403).json({ message: 'Only teachers can update exam status' });
            }
            
            const { status } = req.body;
            
            if (!status || !['draft', 'published', 'closed'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status value' });
            }
            
            const updateData: IUpdateExamDto = { status };
            const updatedExam = await this.examService.updateExam(examId, req.user.id, updateData);
            
            if (!updatedExam) {
                return res.status(404).json({ message: 'Exam not found or not authorized' });
            }
            
            return res.status(200).json(updatedExam);
        } catch (error) {
            console.error('Error updating exam status:', error);
            return res.status(500).json({ message: 'Failed to update exam status' });
        }
    };
}