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

            // Get the subject and student submission content
            const subjectContent = fs.readFileSync(exam.subjectPath, 'utf8');
            const submissionContent = fs.readFileSync(submission.filePath, 'utf8');

            // Get or generate correction template
            let correctionTemplate = '';
            if (exam.correctionTemplatePath && fs.existsSync(exam.correctionTemplatePath)) {
                correctionTemplate = fs.readFileSync(exam.correctionTemplatePath, 'utf8');
            } else {
                // Generate correction template using Ollama
                correctionTemplate = await this.ollamaService.generateCorrectionTemplate(subjectContent);
                
                // Save the generated template
                if (correctionTemplate) {
                    const templatePath = path.join(
                        path.dirname(exam.subjectPath), 
                        `correction_template_${exam.id}.txt`
                    );
                    fs.writeFileSync(templatePath, correctionTemplate);
                    
                    // Update the exam with the template path
                    await this.examModel.update(exam.id, { correctionTemplatePath: templatePath });
                }
            }

            // Use Ollama to grade the submission
            const { grade, feedback } = await this.ollamaService.gradeSubmission(
                subjectContent,
                correctionTemplate,
                submissionContent
            );

            // Save the grade
            await this.gradeModel.create({
                submissionId: submission.id,
                score: grade,
                comment: feedback,
                isAutoGenerated: true,
                criteriaId: 1
            });

            // Update submission status
            await this.submissionModel.update(submission.id, { 
                status: 'graded',
                feedback: feedback 
            });

            // Notify the student
            this.notificationService.notifyStudent(
                submission.studentId,
                `Your submission for ${exam.title} has been graded`,
                `/exams/${exam.id}/submissions/${submission.id}`
            );
        } catch (error) {
            console.error('Error generating automatic grade:', error);
            // Don't throw the error - we don't want to fail the entire process
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
}