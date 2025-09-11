// user types
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// project types
export interface Project {
    id: string;
    name: string;
    description?: string;
    language: string;
    status: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

// auth types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: Omit<User, 'password'>;  // Exclude password from user object
    token: string;
}