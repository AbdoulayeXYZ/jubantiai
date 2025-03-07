import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Exam } from './exam.entity';

@Entity('submissions')
export class Submission {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    studentId!: number;

    @Column()
    examId!: number;

    @Column()
    filePath!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'studentId' })
    student!: User;

    @ManyToOne(() => Exam, exam => exam.submissions)
    @JoinColumn({ name: 'examId' })
    exam!: Exam;
}
