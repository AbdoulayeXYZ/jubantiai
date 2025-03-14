import { SubmissionModel } from '../models/submission.model';
import { ExamModel } from '../models/exam.model';
import { GradeModel } from '../models/grade.model';
import { NotificationService } from '../services/notification.service';
import { OllamaService } from '../services/ollama.service';
import { PlagiarismService } from '../services/plagiarism.service';
import { ICreateSubmissionDto, IUpdateSubmissionDto, ISubmissionFilters, ISubmissionStats } from '../interfaces/submission.interface';
import * as fs from 'fs';
import * as path from 'path';
import { Submission } from '../entities/submission.entity';
const pdfParse = require('pdf-parse');

export class SubmissionService {
    private submissionModel = new SubmissionModel();
    private examModel = new ExamModel();
    private gradeModel = new GradeModel();
    private notificationService = new NotificationService();
    private ollamaService = new OllamaService();
    private plagiarismService = new PlagiarismService();

    async createSubmission(createSubmissionDto: ICreateSubmissionDto, file: Express.Multer.File): Promise<Submission> {
        try {
            // Check if the exam exists and is published
            const exam = await this.examModel.findById(createSubmissionDto.examId);
            if (!exam) {
                throw new Error('Exam not found');
            }
            
            if (exam.status !== 'published') {
                throw new Error('Cannot submit to an exam that is not published');
            }

            // Check if the deadline has passed
            if (exam.deadline && new Date() > exam.deadline) {
                console.log('Late submission detected');
                // We allow late submissions but mark them as late
            }

            // Check if the student has already submitted
            const existingSubmission = await this.submissionModel.findByStudentAndExam(
                createSubmissionDto.studentId, 
                createSubmissionDto.examId
            );

            if (existingSubmission) {
                // Delete the previous file if it exists
                if (existingSubmission.filePath && fs.existsSync(existingSubmission.filePath)) {
                    fs.unlinkSync(existingSubmission.filePath);
                }
                
                // Update the existing submission
                const updatedSubmission = await this.submissionModel.update(existingSubmission.id, {
                    status: 'submitted'
                });
                
                if (!updatedSubmission) {
                    throw new Error('Failed to update submission');
                }
                
                // Process the submission for grading and plagiarism detection
                await this.processSubmission(updatedSubmission.id);
                
                // Notify the teacher
                this.notificationService.notifyTeacher(
                    exam.teacherId,
                    `Student has updated their submission for ${exam.title}`,
                    `/exams/${exam.id}/submissions/${updatedSubmission.id}`
                );
                
                return updatedSubmission;
            }

            // Create a new submission
            const submission = await this.submissionModel.create({
                ...createSubmissionDto,
                filePath: file.path
            });

            // Process the submission for grading and plagiarism detection
            await this.processSubmission(submission.id);

            // Notify the teacher
            this.notificationService.notifyTeacher(
                exam.teacherId,
                `New submission received for ${exam.title}`,
                `/exams/${exam.id}/submissions/${submission.id}`
            );

            return submission;
        } catch (error) {
            // Delete the uploaded file if there was an error
            if (file && file.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            throw error;
        }
    }

    async getAllSubmissions(filters?: ISubmissionFilters): Promise<Submission[]> {
        return this.submissionModel.findAll(filters);
    }

    async getSubmissionById(id: number): Promise<Submission | null> {
        return this.submissionModel.findById(id);
    }

    async updateSubmission(id: number, updateSubmissionDto: IUpdateSubmissionDto): Promise<Submission | null> {
        const submission = await this.submissionModel.findById(id);
        if (!submission) {
            return null;
        }

        // If status is changing to graded, make sure there's a grade
        if (updateSubmissionDto.status === 'graded') {
            const grades = await this.gradeModel.findBySubmissionId(id);
            if (!grades || grades.length === 0) {
                throw new Error('Cannot mark as graded without a grade');
            }
        }

        return this.submissionModel.update(id, updateSubmissionDto);
    }

    async deleteSubmission(id: number): Promise<boolean> {
        return this.submissionModel.delete(id);
    }

    async getSubmissionStats(examId: number): Promise<ISubmissionStats> {
        return this.submissionModel.getSubmissionStats(examId);
    }

    // Process submission for automatic grading and plagiarism detection
    private async processSubmission(submissionId: number): Promise<void> {
        const submission = await this.submissionModel.findById(submissionId);
        if (!submission) {
            throw new Error('Submission not found');
        }

        // Process in parallel
        await Promise.all([
            this.generateAutomaticGrade(submission),
            this.checkForPlagiarism(submission)
        ]);
    }

    // Generate automatic grade using DeepSeek via Ollama
    private async generateAutomaticGrade(submission: Submission): Promise<void> {
        try {
            const exam = await this.examModel.findById(submission.examId);
            if (!exam) {
                throw new Error('Exam not found');
            }

            // Ensure the submission file exists
            if (!submission.filePath || !fs.existsSync(submission.filePath)) {
                console.error(`Submission file not found at path: ${submission.filePath}`);
                throw new Error('Submission file not found');
            }

            // Create submissions directory if it doesn't exist
            const submissionsDir = path.dirname(submission.filePath);
            await fs.promises.mkdir(submissionsDir, { recursive: true });

            // Get the submission content
            let submissionContent: string;
            try {
                if (submission.filePath.toLowerCase().endsWith('.pdf')) {
                    submissionContent = await this.extractTextFromPDF(submission.filePath);
                } else {
                    const fileContent = await fs.promises.readFile(submission.filePath, 'utf8');
                    submissionContent = fileContent;
                }

                if (!submissionContent || submissionContent.trim().length === 0) {
                    throw new Error('No content found in submission file');
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(`Failed to process submission file: ${errorMessage}`);
            }

            // Use Ollama to grade the submission
            const { grade, feedback, justification } = await this.ollamaService.gradeSubmission(
                submissionContent,
                exam.title
            );

            // Save the grade
            await this.gradeModel.create({
                submissionId: submission.id,
                score: grade,
                comment: feedback,
                isAutoGenerated: true,
                criteriaId: 1,
                aiJustification: justification
            });
        } catch (error) {
            console.error('Error in automatic grading:', error);
            throw error;
        }
    }

    // Check for plagiarism
    private async checkForPlagiarism(submission: Submission): Promise<void> {
        try {
            // Get all other submissions for this exam
            const allSubmissions = await this.submissionModel.findAll({
                examId: submission.examId
            });
            
            // Filter out the current submission
            const otherSubmissions = allSubmissions.filter(s => s.id !== submission.id);
            
            if (otherSubmissions.length === 0) {
                // No other submissions to compare with
                return;
            }
            
            // Get the submission content
            const submissionContent = fs.readFileSync(submission.filePath, 'utf8');
            
            // Check each other submission for similarity
            for (const otherSubmission of otherSubmissions) {
                const otherContent = fs.readFileSync(otherSubmission.filePath, 'utf8');
                
                // Calculate similarity score
                const similarityScore = await this.plagiarismService.calculateSimilarity(
                    submissionContent,
                    otherContent
                );
                
                // If similarity is above threshold, create a plagiarism report
                if (similarityScore > 0.6) { // 60% similarity threshold
                    await this.plagiarismService.createPlagiarismReport({
                        submissionId: submission.id,
                        similarSubmissionId: otherSubmission.id,
                        similarityScore: similarityScore,
                        details: `Significant similarity (${(similarityScore * 100).toFixed(2)}%) detected with submission #${otherSubmission.id}`
                    });
                    
                    // Notify the teacher about potential plagiarism
                    const exam = await this.examModel.findById(submission.examId);
                    if (exam) {
                        this.notificationService.notifyTeacher(
                            exam.teacherId,
                            `Potential plagiarism detected in submission for ${exam.title}`,
                            `/exams/${exam.id}/submissions/${submission.id}/plagiarism`
                        );
                    }
                }
            }
        } catch (error) {
            console.error('Error checking for plagiarism:', error);
            // Don't throw the error - we don't want to fail the entire process
        }
    }

    async submitAndGrade(
        studentId: number,
        examId: number,
        file: Express.Multer.File
    ): Promise<Submission> {
        try {
            // 1. Create submission
            const submission = await this.createSubmission(
                { studentId, examId, filePath: file.path },
                file
            );

            // 2. Extract text from PDF
            const pdfContent = await this.extractTextFromPDF(file.path);

            // 3. Get exam details
            const exam = await this.examModel.findExamById(examId);
            if (!exam) {
                throw new Error('Exam not found');
            }

            // 4. Generate AI grade
            const gradeResult = await this.ollamaService.gradeSubmission(
                pdfContent,
                exam.title
            );

            // 5. Create grade record
            await this.gradeModel.create({
                submissionId: submission.id,
                score: gradeResult.grade,
                comment: gradeResult.feedback,
                aiJustification: gradeResult.justification,
                isAutoGenerated: true
            });

            // 6. Update submission status
            await this.submissionModel.update(submission.id, {
                status: 'graded'
            });

            // 7. Notify student
            this.notificationService.notifyStudent(
                submission.studentId,
                `Your submission has been graded`,
                `/exams/${submission.examId}/submissions/${submission.id}`
            );

        const updatedSubmission = await this.submissionModel.findById(submission.id);
        if (!updatedSubmission) {
            throw new Error('Failed to retrieve updated submission');
        }
        return updatedSubmission;
                } catch (error) {
                    console.error('Error in submitAndGrade:', error);
                    throw error;
                }
            }

            private async extractTextFromPDF(filePath: string): Promise<string> {
                try {
                    const dataBuffer = await fs.promises.readFile(filePath);
                    const pdfData = await pdfParse(dataBuffer);
                    return pdfData.text;
                } catch (error: unknown) {
                    console.error('Error extracting PDF text:', error);
                    throw new Error('Failed to extract text from PDF');
                }
            }
}