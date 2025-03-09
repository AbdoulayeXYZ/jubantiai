import express from 'express';
import { GradeController } from '../controllers/grade.controller';
import { authenticateJWT } from '../middleware/auth.middleware'
import { checkRole } from '../middleware/role.middleware';

const router = express.Router();
const gradeController = new GradeController();

// Create a new grade (teachers only)
router.post(
    '/',
    authenticateJWT,
    checkRole(['teacher']),
    gradeController.createGrade
);

// Get a specific grade by ID
router.get(
    '/:id',
    authenticateJWT,
    gradeController.getGradeById
);

// Get grades by submission ID
router.get(
    '/submission/:submissionId',
    authenticateJWT,
    gradeController.getGradesBySubmissionId
);

// Get grades by exam ID (teachers only)
router.get(
    '/exam/:examId',
    authenticateJWT,
    checkRole(['teacher']),
    gradeController.getGradesByExamId
);

// Update a grade (teachers only)
router.put(
    '/:id',
    authenticateJWT,
    checkRole(['teacher']),
    gradeController.updateGrade
);

// Validate a grade (teachers only)
router.patch(
    '/:id/validate',
    authenticateJWT,
    checkRole(['teacher']),
    gradeController.validateGrade
);

// Generate an AI grade for a submission (teachers only)
router.post(
    '/ai-grade/:submissionId',
    authenticateJWT,
    checkRole(['teacher']),
    gradeController.generateAIGrade
);

// Get exam statistics (teachers only)
router.get(
    '/statistics/:examId',
    authenticateJWT,
    checkRole(['teacher']),
    gradeController.getExamStatistics
);

// Get student grades (own grades for students, any student for teachers)
router.get(
    '/student/:studentId?',
    authenticateJWT,
    gradeController.getStudentGrades
);

export default router;