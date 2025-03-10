import { Router } from 'express';
import { GradeController } from '../controllers/grade.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { teacherMiddleware } from '../middleware/teacher.middleware';

const router = Router();
const gradeController = new GradeController();

// Routes protégées nécessitant une authentification
router.use(authMiddleware);

// Routes pour les notes
router.get('/submission/:submissionId', gradeController.getGradesBySubmissionId);
router.get('/exam/:examId', gradeController.getGradesByExamId);
router.get('/:id', gradeController.getGradeById);

// Routes nécessitant des privilèges d'enseignant
router.use(teacherMiddleware);
router.post('/generate/:submissionId', gradeController.generateAIGrade);
router.put('/validate/:id', gradeController.validateGrade);
router.post('/', gradeController.createGrade);
router.put('/:id', gradeController.updateGrade);

export default router; 