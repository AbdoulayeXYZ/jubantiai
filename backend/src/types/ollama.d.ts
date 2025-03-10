declare module 'ollama' {
    export interface OllamaOptions {
        model: string;
        prompt: string;
    }

    export function generate(options: OllamaOptions): Promise<{ response: string }>;
}
