export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
} 