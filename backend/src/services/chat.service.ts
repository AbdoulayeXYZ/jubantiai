import { AppDataSource } from '../configs/data-sources';
import { OllamaService } from './ollama.service';
import { ChatMessage, ChatHistory } from '../interfaces/chat.interface';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AppError } from '../utils/app-error';

export class ChatService {
    private chatHistoryRepository: Repository<ChatHistory>;
    private ollamaService: OllamaService;

    constructor() {
        this.chatHistoryRepository = AppDataSource.getRepository('ChatHistory');
        this.ollamaService = new OllamaService();
    }

    async sendMessage(userId: number, content: string): Promise<ChatMessage> {
        try {
            // Create user message
            const userMessage: ChatMessage = {
                userId,
                content,
                role: 'user',
                timestamp: new Date()
            };

            // Get response from Ollama
            const response = await this.ollamaService.generateSimpleCompletion(content);

            // Create assistant message
            const assistantMessage: ChatMessage = {
                userId,
                content: response,
                role: 'assistant',
                timestamp: new Date()
            };

            // Get or create chat history
            let chatHistory = await this.chatHistoryRepository.findOne({
                where: { userId },
                order: { createdAt: 'DESC' }
            });

            if (!chatHistory) {
                chatHistory = this.chatHistoryRepository.create({
                    userId,
                    messages: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }

            // Add messages to history
            chatHistory.messages.push(userMessage, assistantMessage);
            chatHistory.updatedAt = new Date();

            // Save chat history
            await this.chatHistoryRepository.save(chatHistory);

            return assistantMessage;
        } catch (error) {
            throw new AppError('Failed to process message: ' + (error instanceof Error ? error.message : String(error)), 500);
        }
    }

    async getChatHistory(userId: number): Promise<ChatHistory[]> {
        try {
            return await this.chatHistoryRepository.find({
                where: { userId },
                order: { createdAt: 'DESC' }
            });
        } catch (error) {
            throw new AppError('Failed to process message: ' + (error instanceof Error ? error.message : String(error)), 500);
        }
    }
}