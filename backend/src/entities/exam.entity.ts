import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Submission } from './submission.entity';

@Entity('exams')
export class Exam {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @Column()
    subjectPath!: string;

    @Column({ nullable: true })
    correctionTemplatePath?: string;

    @Column({ 
        type: 'enum', 
        enum: ['draft', 'published', 'closed'],
        default: 'draft'
    })
    status!: 'draft' | 'published' | 'closed';

    @Column({ nullable: true })
    deadline?: Date;

    @Column()
    teacherId!: number;

    @ManyToOne(() => User, user => user.createdExams)
    @JoinColumn({ name: 'teacherId' })
    teacher!: User;

    @OneToMany(() => Submission, submission => submission.exam)
    submissions!: Submission[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}