import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Submission } from './submission.entity';

@Entity('plagiarism_reports')
export class PlagiarismReport {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('float')
    similarityScore!: number;

    @Column()
    submissionId!: number;

    @ManyToOne(() => Submission, submission => submission.plagiarismReports)
    @JoinColumn({ name: 'submissionId' })
    submission!: Submission;

    @Column()
    matchedSubmissionId!: number;
} 