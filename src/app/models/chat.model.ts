export interface ChatMessage {
    id?: number;
    userId: number;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    metadata?: Record<string, any>;
}

export interface ChatHistory {
    id?: number;
    userId: number;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
    title?: string;
    metadata?: Record<string, any>;
}

export interface ChatResponse {
    message: string;
    error?: string;
}