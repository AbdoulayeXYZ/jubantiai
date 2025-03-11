import { AppError } from '../utils/app-error';

interface GradingResult {
    grade: number;
    feedback: string;
    justification: string;
}

interface OllamaResponse {
    response: string;
}

interface GradingFeedback {
    strengths: string[];
    improvements: string[];
    details: string;
}

interface GradingJustification {
    concepts: { score: number; reason: string };
    methodology: { score: number; reason: string };
    structure: { score: number; reason: string };
    additional: { score: number; reason: string };
}

interface GradingResponseData {
    grade: number;
    feedback: GradingFeedback;
    justification: GradingJustification;
}

interface SimpleGrade {
    score: number;
    reason: string;
}

interface AnalysisStep {
    score: number;
    comments: string[];
}

interface CorrectionCriteria {
    description: string;
    criteria: string[];
    maxScore: number;
}

interface CorrectionTemplate {
    understanding: CorrectionCriteria;
    methodology: CorrectionCriteria;
    structure: CorrectionCriteria;
    additional: CorrectionCriteria;
}

export class OllamaService {
    private baseUrl: string = 'http://localhost:11434/api';
    private model: string = 'mistral';
    private timeout: number = 45000;
    private retryCount: number = 3;

    // Template de correction fixe
    private readonly correctionTemplate: CorrectionTemplate = {
        understanding: {
            description: "Évaluation de la compréhension des concepts clés",
            criteria: [
                "Identification des concepts principaux",
                "Application correcte des théories",
                "Liens entre les concepts"
            ],
            maxScore: 8
        },
        methodology: {
            description: "Évaluation de la méthodologie et de l'approche",
            criteria: [
                "Structure logique de la réponse",
                "Utilisation d'exemples pertinents",
                "Argumentation claire"
            ],
            maxScore: 6
        },
        structure: {
            description: "Évaluation de la présentation et organisation",
            criteria: [
                "Clarté de l'expression",
                "Organisation des idées",
                "Qualité de la rédaction"
            ],
            maxScore: 4
        },
        additional: {
            description: "Points supplémentaires pour l'originalité",
            criteria: [
                "Perspectives originales",
                "Exemples innovants",
                "Réflexion approfondie"
            ],
            maxScore: 2
        }
    };

    constructor() {
        console.log('OllamaService initialized with model:', this.model);
        this.checkServiceAvailability();
    }

    private async checkServiceAvailability(): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/tags`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error(`Ollama service is not available: ${response.statusText}`);
            }

            const data = await response.json();
            const modelExists = data.models?.some((model: any) => model.name === this.model);
            
            if (!modelExists) {
                console.warn(`Model ${this.model} not found. Attempting to pull...`);
                await this.pullModel();
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Failed to check Ollama service:', error.message);
                throw new AppError(`Ollama service is not available: ${error.message}`, 500);
            }
            throw new AppError('Ollama service is not available', 500);
        }
    }

    private async pullModel(): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/pull`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: this.model })
            });

            if (!response.ok) {
                throw new Error(`Failed to pull model ${this.model}`);
            }

            console.log(`Successfully pulled model ${this.model}`);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Failed to pull model:', error.message);
                throw new AppError(`Failed to pull model ${this.model}: ${error.message}`, 500);
            }
            throw new AppError(`Failed to pull model ${this.model}`, 500);
        }
    }

    private async generateSimpleCompletion(prompt: string, customTimeout?: number): Promise<string> {
        let lastError: Error | null = null;
        
        for (let attempt = 0; attempt < this.retryCount; attempt++) {
            const controller = new AbortController();
            const timeoutValue = customTimeout || this.timeout;
            const timeoutId = setTimeout(() => controller.abort(), timeoutValue);

            try {
                console.log(`Attempt ${attempt + 1}/${this.retryCount} - Sending request to Ollama with model ${this.model}...`);
                
                const response = await fetch(`${this.baseUrl}/generate`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        model: this.model,
                        prompt: prompt,
                        stream: false,
                        temperature: 0.1,
                        top_p: 0.3,
                        max_tokens: 512,
                        stop: ["</response>"]
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`API error: ${response.statusText}`);
                }

                const data = await response.json() as OllamaResponse;
                if (!data.response) {
                    throw new Error('Empty response from model');
                }

                console.log('Successfully generated response');
                return data.response;

            } catch (error: unknown) {
                clearTimeout(timeoutId);
                
                if (error instanceof Error) {
                    lastError = error;
                    console.warn(`Attempt ${attempt + 1} failed:`, error.message);
                    
                    if (error.name === 'AbortError') {
                        console.log('Request timed out, retrying with increased timeout...');
                        customTimeout = timeoutValue * 1.5;
                        continue;
                    }
                }
                
                if (attempt === this.retryCount - 1) {
                    throw new AppError(`Generation failed after ${this.retryCount} attempts: ${lastError?.message || 'Unknown error'}`, 500);
                }
                
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }

        throw new AppError('Failed to generate response after all attempts', 500);
    }

    private async analyzeUnderstanding(submission: string): Promise<AnalysisStep> {
        const prompt = `Analyze the understanding based on these criteria:
${this.correctionTemplate.understanding.criteria.join(', ')}

Submission: ${submission.substring(0, 500)}

Rate from 0-${this.correctionTemplate.understanding.maxScore} and list specific points that justify the score.
Format: Start with the score (e.g., "Score: 6/8") then list key points.`;

        const response = await this.generateSimpleCompletion(prompt);
        const lines = response.split('\n').filter(line => line.trim());
        const scoreMatch = response.match(/(\d+)\/8|(\d+) out of 8/);
        const score = scoreMatch ? Math.min(8, Math.max(0, parseInt(scoreMatch[1] || scoreMatch[2]))) : 4;

        return {
            score,
            comments: lines.filter(line => !line.includes('/8') && !line.includes(' out of 8'))
        };
    }

    private async analyzeMethodology(submission: string): Promise<AnalysisStep> {
        const prompt = `Analyze the methodology based on these criteria:
${this.correctionTemplate.methodology.criteria.join(', ')}

Submission: ${submission.substring(0, 500)}

Rate from 0-${this.correctionTemplate.methodology.maxScore} and list specific points that justify the score.
Format: Start with the score (e.g., "Score: 4/6") then list key points.`;

        const response = await this.generateSimpleCompletion(prompt);
        const lines = response.split('\n').filter(line => line.trim());
        const scoreMatch = response.match(/(\d+)\/6|(\d+) out of 6/);
        const score = scoreMatch ? Math.min(6, Math.max(0, parseInt(scoreMatch[1] || scoreMatch[2]))) : 3;

        return {
            score,
            comments: lines.filter(line => !line.includes('/6') && !line.includes(' out of 6'))
        };
    }

    private async analyzeStructure(submission: string): Promise<AnalysisStep> {
        const prompt = `Analyze the structure based on these criteria:
${this.correctionTemplate.structure.criteria.join(', ')}

Submission: ${submission.substring(0, 300)}

Rate from 0-${this.correctionTemplate.structure.maxScore} and list specific points that justify the score.
Format: Start with the score (e.g., "Score: 3/4") then list key points.`;

        const response = await this.generateSimpleCompletion(prompt);
        const lines = response.split('\n').filter(line => line.trim());
        const scoreMatch = response.match(/(\d+)\/4|(\d+) out of 4/);
        const score = scoreMatch ? Math.min(4, Math.max(0, parseInt(scoreMatch[1] || scoreMatch[2]))) : 2;

        return {
            score,
            comments: lines.filter(line => !line.includes('/4') && !line.includes(' out of 4'))
        };
    }

    private async analyzeAdditionalMerit(submission: string): Promise<AnalysisStep> {
        const prompt = `Analyze additional merits based on these criteria:
${this.correctionTemplate.additional.criteria.join(', ')}

Submission: ${submission.substring(0, 300)}

Rate from 0-${this.correctionTemplate.additional.maxScore} and list specific points that justify the score.
Format: Start with the score (e.g., "Score: 1/2") then list key points.`;

        const response = await this.generateSimpleCompletion(prompt);
        const lines = response.split('\n').filter(line => line.trim());
        const scoreMatch = response.match(/(\d+)\/2|(\d+) out of 2/);
        const score = scoreMatch ? Math.min(2, Math.max(0, parseInt(scoreMatch[1] || scoreMatch[2]))) : 1;

        return {
            score,
            comments: lines.filter(line => !line.includes('/2') && !line.includes(' out of 2'))
        };
    }

    async gradeSubmission(
        studentSubmission: string,
        _correctionTemplate: string, // On ignore le template fourni
        _examSubject: string // On ignore le sujet fourni
    ): Promise<GradingResult> {
        try {
            console.log('Starting grading process with fixed template...');

            const understanding = await this.analyzeUnderstanding(studentSubmission);
            const methodology = await this.analyzeMethodology(studentSubmission);
            const structure = await this.analyzeStructure(studentSubmission);
            const additional = await this.analyzeAdditionalMerit(studentSubmission);

            const finalGrade = understanding.score + methodology.score + 
                             structure.score + additional.score;

            const strengths = [...understanding.comments, ...methodology.comments]
                .filter(comment => comment.toLowerCase().includes('good') || 
                                 comment.toLowerCase().includes('strong') ||
                                 comment.toLowerCase().includes('excellent'))
                .slice(0, 3);

            const improvements = [...understanding.comments, ...methodology.comments]
                .filter(comment => comment.toLowerCase().includes('could') || 
                                 comment.toLowerCase().includes('should') ||
                                 comment.toLowerCase().includes('need'))
                .slice(0, 3);

            const feedback = {
                strengths,
                improvements,
                details: `Compréhension: ${understanding.comments[0] || 'Adequate'}\nMéthodologie: ${methodology.comments[0] || 'Satisfactory'}`
            };

            return {
                grade: finalGrade,
                feedback: this.formatFeedback(feedback),
                justification: `Compréhension (${understanding.score}/8): ${understanding.comments[0] || ''}\n` +
                             `Méthodologie (${methodology.score}/6): ${methodology.comments[0] || ''}\n` +
                             `Structure (${structure.score}/4): ${structure.comments[0] || ''}\n` +
                             `Points supplémentaires (${additional.score}/2): ${additional.comments[0] || ''}`
            };

        } catch (error: unknown) {
            console.error('Error during grading:', error);
            if (error instanceof Error) {
                throw new AppError(`Grading failed: ${error.message}`, 500);
            }
            throw new AppError('Grading failed with unknown error', 500);
        }
    }

    private isValidGradingResult(result: unknown): result is GradingResponseData {
        if (!result || typeof result !== 'object') return false;
        
        const r = result as GradingResponseData;
        return (
            typeof r.grade === 'number' &&
            r.feedback && typeof r.feedback === 'object' &&
            Array.isArray(r.feedback.strengths) &&
            Array.isArray(r.feedback.improvements) &&
            typeof r.feedback.details === 'string' &&
            r.justification && typeof r.justification === 'object' &&
            this.isValidJustification(r.justification)
        );
    }

    private isValidJustification(justification: unknown): justification is GradingJustification {
        if (!justification || typeof justification !== 'object') return false;
        
        const j = justification as GradingJustification;
        const sections = ['concepts', 'methodology', 'structure', 'additional'];
        
        return sections.every(section => 
            j[section as keyof GradingJustification] &&
            typeof j[section as keyof GradingJustification].score === 'number' &&
            typeof j[section as keyof GradingJustification].reason === 'string'
        );
    }

    private formatFeedback(feedback: GradingFeedback): string {
        let formattedFeedback = '';
        
        if (feedback.strengths?.length) {
            formattedFeedback += '💪 Forces:\n' + feedback.strengths.map(s => `• ${s}`).join('\n') + '\n\n';
        }
        
        if (feedback.improvements?.length) {
            formattedFeedback += '📈 Points à améliorer:\n' + feedback.improvements.map(i => `• ${i}`).join('\n') + '\n\n';
        }
        
        if (feedback.details) {
            formattedFeedback += '📝 Détails:\n' + feedback.details;
        }
        
        return formattedFeedback;
    }

    private formatJustification(justification: GradingJustification): string {
        const sections = {
            concepts: 'Compréhension des concepts',
            methodology: 'Méthodologie',
            structure: 'Structure et clarté',
            additional: 'Points supplémentaires'
        };

        return Object.entries(sections)
            .map(([key, title]) => {
                const section = justification[key as keyof GradingJustification];
                return `${title} (${section.score}/20):\n${section.reason}`;
            })
            .join('\n\n');
    }

    // Méthode pour exposer les critères de correction
    getCorrectionCriteria(): CorrectionTemplate {
        return this.correctionTemplate;
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

        const response = await this.generateSimpleCompletion(prompt);
        const similarity = parseFloat(response);
        return isNaN(similarity) ? 0 : Math.min(Math.max(0, similarity), 100);
    }
}
