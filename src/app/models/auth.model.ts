export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    role: 'student' | 'teacher';
  };
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  role: 'student' | 'teacher';
}

export interface User {
  type: string;
  id: number;
  email: string;
  password?: string; // Make password optional since we don't want to store it in localStorage
  role: 'student' | 'teacher';
  createdAt?: Date;
  updatedAt?: Date;
}
