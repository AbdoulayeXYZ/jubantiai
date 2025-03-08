import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Exam } from './exam.entity';
import { Grade } from './grade.entity';
import { PlagiarismReport } from './plagiarism-report.entity';

@Entity('submissions')
export class Submission {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    filePath!: string;

    @Column({ 
        type: 'enum', 
        enum: ['pending', 'submitted', 'graded'],
        default: 'pending'
    })
    status!: 'pending' | 'submitted' | 'graded';

    @Column({ type: 'text', nullable: true })
    feedback?: string;

    @Column()
    studentId!: number;

    @Column()
    examId!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'studentId' })
    student!: User;

    @ManyToOne(() => Exam, exam => exam.submissions)
    @JoinColumn({ name: 'examId' })
    exam!: Exam;

    @OneToMany(() => Grade, grade => grade.submission)
    grades!: Grade[];

    @OneToMany(() => PlagiarismReport, report => report.submission)
    plagiarismReports!: PlagiarismReport[];

    @Column({ default: false })
    isLate!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}