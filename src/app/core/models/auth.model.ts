// User models
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher';
}

// Auth models
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher';
}

export interface AuthResponse {
  user: User;
  token: string;
}