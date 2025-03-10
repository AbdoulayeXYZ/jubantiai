import { AppError } from '../utils/app-error';

interface GradingResult {
    grade: number;
    feedback: string;
    justification: string;
}

export class OllamaService {
    private baseUrl: string = 'http://localhost:11434/api/generate';
    private model: string = 'deepseek-r1';

    constructor() {
        console.log('OllamaService initialized with model:', this.model);
    }

    private async generateCompletion(prompt: string): Promise<string> {
        try {
            const response = await fetch(this.baseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: this.model,
                    prompt: prompt,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.response || ''; // Vérifie que la réponse contient bien du texte
        } catch (error) {
            console.error('Error generating completion:', error);
            throw new AppError('Failed to generate completion', 500);
        }
    }

    async generateCorrectionTemplate(examContent: string): Promise<string> {
        const prompt = `As an expert teacher, create a detailed correction template for the following exam:

${examContent}

The template should include:
1. Key concepts and topics to be evaluated
2. Expected answers and their variations
3. Point distribution for each section
4. Evaluation criteria
5. Common mistakes to watch for

Please provide a structured and comprehensive template that can be used to grade student submissions consistently.`;

        return await this.generateCompletion(prompt);
    }

    async gradeSubmission(
        studentSubmission: string,
        correctionTemplate: string,
        examSubject: string
    ): Promise<GradingResult> {
        const prompt = `You are an expert teacher grading an exam submission. Analyze the following materials and provide a detailed evaluation.

MATERIALS:
1. Exam Subject:
${examSubject}

2. Correction Template:
${correctionTemplate}

3. Student Submission:
${studentSubmission}

GRADING INSTRUCTIONS:
1. Compare the submission against the correction template criteria
2. Evaluate understanding of key concepts (8 points)
3. Assess methodological approach (6 points)
4. Review presentation and structure (4 points)
5. Consider additional insights (2 points)

PROVIDE YOUR EVALUATION IN THIS EXACT JSON FORMAT:
{
    "grade": <number between 0 and 20>,
    "feedback": "<detailed point-by-point feedback highlighting strengths and areas for improvement>",
    "justification": "<clear explanation of grade breakdown based on correction template criteria>"
}

Ensure your response is a valid JSON object and includes all required fields.`;

        const response = await this.generateCompletion(prompt);
        try {
            const result = JSON.parse(response);
            return {
                grade: Math.min(Math.max(0, result.grade), 20),
                feedback: result.feedback,
                justification: result.justification
            };
        } catch (error) {
            console.error('Error parsing grading result:', error);
            throw new AppError('Failed to parse grading result', 500);
        }
    }

    async compareSubmissions(submission1: string, submission2: string): Promise<number> {
        const prompt = `Compare these two exam submissions for potential plagiarism and return a similarity score.

SUBMISSION 1:
${submission1}

SUBMISSION 2:
${submission2}

Analyze for:
1. Textual similarity
2. Structural patterns
3. Unique expressions
4. Shared mistakes or insights

Return ONLY a number between 0 and 100 representing the similarity percentage.`;

        const response = await this.generateCompletion(prompt);
        const similarity = parseFloat(response);
        return isNaN(similarity) ? 0 : Math.min(Math.max(0, similarity), 100);
    }
}
