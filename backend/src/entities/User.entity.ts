import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exam } from './exam.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    // @Column()
    // firstName!: string;

    // @Column()
    // lastName!: string;

    @Column({
        type: 'enum',
        enum: ['student', 'teacher'],
        default: 'student'
    })
    role!: 'student' | 'teacher';

    @OneToMany(() => Exam, exam => exam.teacher)
    createdExams!: Exam[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 