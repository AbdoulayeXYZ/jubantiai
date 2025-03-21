import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Submission } from './submission.entity';
import { User } from './user.entity';

@Entity('grades')
export class Grade {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('float')
    score!: number;

    @Column({ type: 'text', nullable: true })
    @Column({ type: 'int', nullable: true })
    comment?: string;

    @Column()
    submissionId!: number;

    @ManyToOne(() => Submission, submission => submission.grades)
    @JoinColumn({ name: 'submissionId' })
    submission!: Submission;

    @Column({ nullable: true })
    criteriaId?: number;

    @Column({ default: false })
    isAutoGenerated!: boolean;

    @Column({ default: false })
    isValidated!: boolean;

    @Column({ type: 'int', nullable: true })
    validatedBy?: number;

    @Column({ type: 'text', nullable: true })
    aiJustification?: string;

    @Column({ type: 'text', nullable: true })
    key_concepts?: string;

    @Column({ type: 'text', nullable: true })
    methodological_approach?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
