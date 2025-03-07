export interface IExam{
    id?: number;
    title: string;
    description?: string;
    subjectPath: string;
    correctionTemplatePath?: string;
    status: 'draft' | 'published' | 'closed';
    deadline?: Date;
    teacherId: number;
    createdAt?: Date;
    updatedAt?: Date;
}


