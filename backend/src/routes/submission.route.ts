import express from 'express';
import { SubmissionController } from '../controllers/submission.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads/submissions');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `submission-${uniqueSuffix}${extension}`);
    }
});

// Configure file filter
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
const submissionController = new SubmissionController();

// Add the new route for submission with automatic grading
router.post(
    '/:examId/submit-and-grade',
    authMiddleware,
    upload.single('file'),
    submissionController.submitAndGrade
);

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create a new submission for an exam
router.post('/exams/:examId/submit', 
    upload.single('file'),
    submissionController.create.bind(submissionController)
);

// Get all submissions for an exam (teacher only)
router.get('/exams/:examId/submissions',
    submissionController.getAllForExam.bind(submissionController)
);

// Get submission statistics for an exam
router.get('/exams/:examId/submissions/stats',
    submissionController.getStats.bind(submissionController)
);

// Get student's own submission for an exam
router.get('/exams/:examId/my-submission',
    submissionController.getMySubmission
);

// Get a specific submission by ID
router.get('/submissions/:id',
    submissionController.getById
);

// Update a submission (teacher only)
router.put('/submissions/:id',
    submissionController.update
);

// Delete a submission (teacher only)
router.delete('/submissions/:id',
    submissionController.delete
);

// Download submission file
router.get('/submissions/:id/download',
    submissionController.downloadFile
);

export default router;
