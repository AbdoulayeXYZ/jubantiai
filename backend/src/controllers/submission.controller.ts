import { Request, Response } from 'express';
import { SubmissionService } from '../services/submission.service';
import { ExamService } from '../services/exam.service';
import { ICreateSubmissionDto, IUpdateSubmissionDto } from '../interfaces/submission.interface';

export class SubmissionController {
    public submissionService = new SubmissionService();
    private examService = new ExamService();

    // Create a new submission
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            const { examId } = req.params;
            const studentId = req.user.id; // From the authentication middleware
            
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            // Validate exam exists and is active
            const exam = await this.examService.getExamById(parseInt(examId));
            if (!exam) {
                res.status(404).json({ message: 'Exam not found' });
                return;
            }

            if (exam.status !== 'published') {
                res.status(400).json({ message: 'Cannot submit to an unpublished exam' });
                return;
            }

            // Check if user is a student
            if (req.user.role !== 'student') {
                res.status(403).json({ message: 'Only students can submit exam responses' });
                return;
            }

            const createSubmissionDto: ICreateSubmissionDto = {
                examId: parseInt(examId),
                studentId: studentId,
                filePath: req.file.path // Assuming the file path is stored in req.file.path
            };

            const submission = await this.submissionService.createSubmission(
                createSubmissionDto,
                req.file
            );

            res.status(201).json(submission);
        } catch (error) {
            console.error('Error creating submission:', error);
            res.status(500).json({ 
                message: 'Error creating submission', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    }

    // Get all submissions (for teachers)
    getAllForExam = async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        try {
            const examId = parseInt(req.params.examId);
            if (isNaN(examId)) {
                res.status(400).json({ message: 'Invalid exam ID format' });
                return;
            }
            
            // Validate exam exists
            const exam = await this.examService.getExamById(examId);
            if (!exam) {
                res.status(404).json({ message: 'Exam not found' });
                return;
            }

            // Check if user is the teacher of this exam
            if (req.user.role === 'teacher' && exam.teacherId !== req.user.id) {
                res.status(403).json({ message: 'You can only view submissions for your own exams' });
                return;
            }

            const submissions = await this.submissionService.getAllSubmissions({ 
                examId: examId
            });

            res.status(200).json(submissions);
        } catch (error) {
            console.error('Error getting submissions:', error);
            res.status(500).json({ 
                message: 'Error getting submissions', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    }

    // Get submission statistics for an exam
    getStats = async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        try {
            const { examId } = req.params;
            
            // Validate exam exists
            const exam = await this.examService.getExamById(parseInt(examId));
            if (!exam) {
                res.status(404).json({ message: 'Exam not found' });
                return;
            }

            // Check if user is the teacher of this exam
            if (req.user.role === 'teacher' && exam.teacherId !== req.user.id) {
                res.status(403).json({ message: 'You can only view statistics for your own exams' });
                return;
            }

            const stats = await this.submissionService.getSubmissionStats(parseInt(examId));
            res.status(200).json(stats);
        } catch (error) {
            console.error('Error getting submission stats:', error);
            res.status(500).json({ 
                message: 'Error getting submission statistics', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    }

    // Get a student's own submission
    getMySubmission = async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        try {
            const { examId } = req.params;
            const studentId = req.user.id;

            // Check if user is a student
            if (req.user.role !== 'student') {
                res.status(403).json({ message: 'Only students can view their submissions' });
                return;
            }

            const submissions = await this.submissionService.getAllSubmissions({
                examId: parseInt(examId),
                studentId: studentId
            });

            if (submissions.length === 0) {
                res.status(404).json({ message: 'No submission found' });
                return;
            }

            res.status(200).json(submissions[0]);
        } catch (error) {
            console.error('Error getting submission:', error);
            res.status(500).json({ 
                message: 'Error getting submission', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    }

    // Get a specific submission by ID
    getById = async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        try {
            const { id } = req.params;
            
            const submission = await this.submissionService.getSubmissionById(parseInt(id));
            if (!submission) {
                res.status(404).json({ message: 'Submission not found' });
                return;
            }

            // Check permissions
            if (req.user.role === 'student' && submission.studentId !== req.user.id) {
                res.status(403).json({ message: 'You can only view your own submissions' });
                return;
            }

            if (req.user.role === 'teacher') {
                // Get the exam to check if this teacher owns it
                const exam = await this.examService.getExamById(submission.examId);
                if (!exam || exam.teacherId !== req.user.id) {
                    res.status(403).json({ message: 'You can only view submissions for your own exams' });
                    return;
                }
            }

            res.status(200).json(submission);
        } catch (error) {
            console.error('Error getting submission:', error);
            res.status(500).json({ 
                message: 'Error getting submission', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    }

    // Update a submission (for teachers providing feedback or updating status)
    update = async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        try {
            const { id } = req.params;
            const updateData: IUpdateSubmissionDto = req.body;
            
            // Validate submission exists
            const submission = await this.submissionService.getSubmissionById(parseInt(id));
            if (!submission) {
                res.status(404).json({ message: 'Submission not found' });
                return;
            }

            // Check if user is a teacher
            if (req.user.role !== 'teacher') {
                res.status(403).json({ message: 'Only teachers can update submissions' });
                return;
            }

            // Check if this teacher owns the exam
            const exam = await this.examService.getExamById(submission.examId);
            if (!exam || exam.teacherId !== req.user.id) {
                res.status(403).json({ message: 'You can only update submissions for your own exams' });
                return;
            }

            const updatedSubmission = await this.submissionService.updateSubmission(
                parseInt(id),
                updateData
            );

            res.status(200).json(updatedSubmission);
        } catch (error) {
            console.error('Error updating submission:', error);
            res.status(500).json({ 
                message: 'Error updating submission', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    }

    // Delete a submission (primarily for admin purposes)
    delete = async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        try {
            const { id } = req.params;
            
            // Validate submission exists
            const submission = await this.submissionService.getSubmissionById(parseInt(id));
            if (!submission) {
                res.status(404).json({ message: 'Submission not found' });
                return;
            }

            // Check if user is a teacher
            if (req.user.role !== 'teacher') {
                res.status(403).json({ message: 'Only teachers can delete submissions' });
                return;
            }

            // Check if this teacher owns the exam
            const exam = await this.examService.getExamById(submission.examId);
            if (!exam || exam.teacherId !== req.user.id) {
                res.status(403).json({ message: 'You can only delete submissions for your own exams' });
                return;
            }

            const success = await this.submissionService.deleteSubmission(parseInt(id));
            if (success) {
                res.status(200).json({ message: 'Submission deleted successfully' });
            } else {
                res.status(500).json({ message: 'Failed to delete submission' });
            }
        } catch (error) {
            console.error('Error deleting submission:', error);
            res.status(500).json({ 
                message: 'Error deleting submission', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    }

    // Download submission file
    downloadFile = async (req: Request, res: Response): Promise<void> => {
        if (!req.user) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        try {
            const { id } = req.params;
            const submission = await this.submissionService.getSubmissionById(parseInt(id));
            if (!submission) {
                res.status(404).json({ message: 'Submission not found' });
                return;
            }

            // Check permissions
            if (req.user.role === 'student' && submission.studentId !== req.user.id) {
                res.status(403).json({ message: 'You can only download your own submissions' });
                return;
            }

            if (req.user.role === 'teacher') {
                // Get the exam to check if this teacher owns it
                const exam = await this.examService.getExamById(submission.examId);
                if (!exam || exam.teacherId !== req.user.id) {
                    res.status(403).json({ message: 'You can only download submissions for your own exams' });
                    return;
                }
            }

            // Assuming the file path is stored in submission.filePath
            const filePath = submission.filePath;
            if (!filePath) {
                res.status(404).json({ message: 'File not found' });
                return;
            }

            res.download(filePath);
        } catch (error) {
            console.error('Error downloading submission file:', error);
            res.status(500).json({ 
                message: 'Error downloading submission file', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    }

    submitAndGrade = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            const examId = parseInt(req.params.examId);
            const studentId = req.user.id;

            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            const submission = await this.submissionService.submitAndGrade(
                studentId,
                examId,
                req.file
            );

            res.status(201).json({
                message: 'Submission received and graded',
                submission
            });
        } catch (error) {
            console.error('Error in submitAndGrade:', error);
            res.status(500).json({
                message: 'Failed to process submission',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };
}