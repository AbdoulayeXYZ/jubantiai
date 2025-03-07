export interface User {
    id?: number;
    email: string;
    password: string;
    role: 'teacher' | 'student';
    createdAt?: Date;
    updatedAt?: Date;
}
