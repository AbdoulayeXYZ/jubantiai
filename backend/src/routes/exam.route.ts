import express from 'express';
import { ExamController } from '../controllers/exam.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure storage for exam files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads/exams');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `exam-${uniqueSuffix}${extension}`);
    }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept PDF files
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB max file size
    }
});

const router = express.Router();
const examController = new ExamController();

// Apply auth middleware to all exam routes
router.use(authMiddleware);

// Create a new exam (teacher only, requires file upload)
router.post('/', upload.single('subjectFile'), examController.createExam);

// Update correction template
router.post('/:id/correction-template', upload.single('templateFile'), examController.updateCorrectionTemplate);

// Get all exams (for teacher: their exams, for student: published exams)
router.get('/', examController.getExams);

// Get a specific exam
router.get('/:id', examController.getExamById);

// Update an exam (teacher only)
router.put('/:id', examController.updateExam);

// Delete an exam (teacher only)
router.delete('/:id', examController.deleteExam);

// Generate correction template (teacher only)
router.post('/:id/generate-correction', examController.generateCorrectionTemplate);

// Download exam subject (accessible to both teachers and students)
router.get('/:id/download-subject', examController.downloadExamSubject);

// Download correction template (teacher only)
router.get('/:id/download-correction', examController.downloadCorrectionTemplate);

export default router;