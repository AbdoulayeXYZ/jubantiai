export interface ChatMessage {
    id?: number;
    userId: number;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}

export interface ChatHistory {
    id?: number;
    userId: number;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatResponse {
    message: string;
    error?: string;
}