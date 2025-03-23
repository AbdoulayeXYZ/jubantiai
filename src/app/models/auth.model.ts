export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'student' | 'teacher';
  };
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher';
}

export interface User {
  id: number;
  email: string;
  password?: string; // Make password optional since we don't want to store it in localStorage
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher';
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
