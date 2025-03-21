import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ChatMessage } from '../interfaces/chat.interface';

@Entity('chat_histories')
export class ChatHistory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @Column('json')
    messages!: ChatMessage[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}