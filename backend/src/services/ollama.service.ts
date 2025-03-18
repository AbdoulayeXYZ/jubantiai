import { AppError } from '../utils/app-error';
import pdfParse from 'pdf-parse';  // Changed to default import

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
    private model: string = 'deepseek-r1:latest';
    private timeout: number = 120000; // Increased to 2 minutes
    private retryCount: number = 5; // Increased retry attempts
    private maxTokens: number = 2048; // Increased token limit

    private correctionTemplate: CorrectionTemplate = {
        understanding: {
            description: "Understanding of core concepts and requirements",
            criteria: [
                "Demonstrates clear understanding of the problem domain",
                "Correctly interprets and addresses all requirements",
                "Shows depth of knowledge in relevant concepts"
            ],
            maxScore: 25
        },
        methodology: {
            description: "Approach and problem-solving methodology",
            criteria: [
                "Uses appropriate methods and techniques",
                "Shows logical and structured approach",
                "Demonstrates effective problem-solving strategy"
            ],
            maxScore: 25
        },
        structure: {
            description: "Organization and presentation",
            criteria: [
                "Clear and logical structure",
                "Well-organized content",
                "Professional presentation"
            ],
            maxScore: 25
        },
        additional: {
            description: "Additional considerations and creativity",
            criteria: [
                "Shows innovative thinking",
                "Includes relevant examples and justifications",
                "Demonstrates attention to detail"
            ],
            maxScore: 25
        }
    };

    private async generateSimpleCompletion(prompt: string, customTimeout?: number): Promise<string> {
        let lastError: Error | null = null;
        
        for (let attempt = 0; attempt < this.retryCount; attempt++) {
            const controller = new AbortController();
            const timeoutValue = customTimeout || this.timeout;
            const timeoutId = setTimeout(() => controller.abort(), timeoutValue);

            try {
                console.log(`Attempt ${attempt + 1}/${this.retryCount} - Sending request to Ollama...`);
                
                const response = await fetch(`${this.baseUrl}/generate`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: this.model,
                        prompt: prompt,
                        stream: false,
                        temperature: 0.1,
                        top_p: 0.3,
                        max_tokens: this.maxTokens,
                        stop: ["</response>"],
                        raw: true // Added for better stability
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

                return data.response;

            } catch (error: unknown) {
                clearTimeout(timeoutId);
                
                if (error instanceof Error) {
                    lastError = error;
                    console.error(`Attempt ${attempt + 1} failed:`, error.message);
                    
                    if (error.name === 'AbortError') {
                        console.log(`Request timed out after ${timeoutValue}ms, retrying...`);
                        customTimeout = timeoutValue * 1.5;
                        await new Promise(resolve => setTimeout(resolve, 1000));
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

    private async extractPDFContent(pdfContent: string): Promise<string> {
        try {
            console.log('Attempting to extract text from PDF content...');
            
            // Convert string to Buffer if it's base64 or raw PDF content
            const buffer = Buffer.from(pdfContent, 'binary');
            
            // Parse PDF with correct version
            const pdfData = await pdfParse(buffer, {
                max: 50, // Maximum pages to parse
                version: 'v2.0.550'  // Updated to correct version string
            });

            if (!pdfData.text || pdfData.text.length === 0) {
                throw new AppError('No text content extracted from PDF', 400);
            }

            console.log(`Successfully extracted ${pdfData.text.length} characters from PDF`);
            return pdfData.text;
        } catch (error) {
            console.error('PDF extraction failed:', error);
            throw new AppError('Failed to extract text from PDF: ' + (error instanceof Error ? error.message : 'Unknown error'), 400);
        }
    }

    private async preprocessSubmission(submissionContent: string): Promise<string> {
        try {
            console.log('Starting preprocessing of submission content...');
            
            if (!submissionContent) {
                console.error('Received empty submission content');
                throw new AppError('Empty submission content', 400);
            }

            // Handle PDF content
            let textContent = submissionContent;
            if (submissionContent.startsWith('%PDF')) {
                console.log('PDF content detected, extracting text...');
                textContent = await this.extractPDFContent(submissionContent);
            }

            // Clean and truncate the content
            const cleaned = textContent
                .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
                .replace(/\s+/g, ' ') // Normalize whitespace
                .replace(/[^\x20-\x7E\u00A0-\u00FF]/g, '') // Keep only printable ASCII and extended Latin
                .trim();

            if (!cleaned || cleaned.length < 50) {
                console.warn(`Cleaned content too short: ${cleaned?.length || 0} characters`);
                throw new AppError('Submission content too short or invalid (minimum 50 characters required)', 400);
            }

            const truncated = cleaned.substring(0, 4000);
            console.log(`Preprocessed content length: ${truncated.length} characters`);
            console.log(`Preprocessed content preview: ${truncated.substring(0, 100)}...`);

            return truncated;
        } catch (error) {
            console.error('Error preprocessing submission:', error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Failed to process submission content: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
        }
    }

    async gradeSubmission(
        submissionContent: string,
        examTitle: string
    ): Promise<GradingResult> {
        try {
            console.log('Starting submission grading process...');
            
            // Preprocess the submission content
            const processedContent = await this.preprocessSubmission(submissionContent);
            
            // Prepare the grading prompt using the correction template
            const prompt = `You are a grading assistant. Grade the following submission using these criteria and respond ONLY with valid JSON.

${Object.entries(this.correctionTemplate).map(([category, criteria]: [string, CorrectionCriteria]) => {
    return `${criteria.description} (${criteria.maxScore} points):\n${criteria.criteria.map((c: string) => `- ${c}`).join('\n')}`;
}).join('\n\n')}

Submission Content:\n${processedContent}\n\nYou must provide your response in this exact JSON format with no additional text:
{
  "grade": [number between 0-100],
  "feedback": {
    "strengths": ["strength1", "strength2", "strength3"],
    "improvements": ["improvement1", "improvement2", "improvement3"],
    "details": "detailed feedback paragraph"
  },
  "justification": {
    "concepts": { "score": [number], "reason": "reason for score" },
    "methodology": { "score": [number], "reason": "reason for score" },
    "structure": { "score": [number], "reason": "reason for score" },
    "additional": { "score": [number], "reason": "reason for score" }
  }
}`;

            // Get the grading response from the model
            const response = await this.generateSimpleCompletion(prompt);
            
            try {
                // Extract JSON from the response
                let jsonStr = response;
                
                // Find JSON content if the model returned additional text
                const jsonMatch = response.match(/(\{[\s\S]*\})/);
                if (jsonMatch && jsonMatch[0]) {
                    jsonStr = jsonMatch[0];
                }
                
                // Additional cleanup to handle potential formatting issues
                jsonStr = jsonStr.replace(/^\s*```json/, '').replace(/```\s*$/, '');
                
                console.log("Attempting to parse JSON response:", jsonStr.substring(0, 200) + "...");
                
                // Parse the cleaned JSON response
                const gradingData = JSON.parse(jsonStr) as GradingResponseData;
                
                // Verify required fields exist
                if (gradingData.grade === undefined || !gradingData.feedback || !gradingData.justification) {
                    throw new Error("Missing required fields in grading response");
                }
                
                return {
                    grade: gradingData.grade,
                    feedback: `Strengths:\n${gradingData.feedback.strengths.join('\n')}\n\nAreas for Improvement:\n${gradingData.feedback.improvements.join('\n')}\n\n${gradingData.feedback.details}`,
                    justification: JSON.stringify(gradingData.justification, null, 2)
                };
            } catch (parseError) {
                console.error('Failed to parse grading response:', parseError);
                console.error('Raw response:', response);
                
                // Fallback response if parsing fails
                return this.generateFallbackGradingResult(processedContent);
            }
        } catch (error) {
            console.error('Error in gradeSubmission:', error);
            throw error instanceof AppError ? error : new AppError('Failed to grade submission', 500);
        }
    }
    
    // Fallback method for when JSON parsing fails
    private generateFallbackGradingResult(submissionContent: string): GradingResult {
        console.log("Generating fallback grading result");
        
        // Calculate a basic score based on word count
        const wordCount = submissionContent.split(/\s+/).length;
        let score = Math.min(Math.max(50 + (wordCount / 100), 50), 85);
        
        // Round to whole number
        score = Math.round(score);
        
        const feedback = `This submission has been automatically graded based on its length and content. The submission contains approximately ${wordCount} words. Please review this automated grade.`;
        
        const justification = JSON.stringify({
            concepts: { score: Math.round(score * 0.25), reason: "Automated score based on content length" },
            methodology: { score: Math.round(score * 0.25), reason: "Automated score based on content length" },
            structure: { score: Math.round(score * 0.25), reason: "Automated score based on content length" },
            additional: { score: Math.round(score * 0.25), reason: "Automated score based on content length" }
        }, null, 2);
        
        return {
            grade: score,
            feedback,
            justification
        };
    }
}