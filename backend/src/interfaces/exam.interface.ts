export interface IExam {
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

export interface ICreateExamDto {
    title: string;
    description?: string;
    status?: 'draft' | 'published' | 'closed';
    deadline?: Date;
}

export interface IUpdateExamDto {
    title?: string;
    description?: string;
    status?: 'draft' | 'published' | 'closed';
    deadline?: Date;
    correctionTemplatePath?: string;
}

export interface IExamWithSubmissionsCount extends IExam {
    submissionsCount: number;
}

export interface IExamWithTeacher extends IExam {
    teacher: {
        id: number;
        email: string;
    };
}