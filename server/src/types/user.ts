// user types
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
    isActive: boolean;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserProfile extends Omit<User, 'password'> {}

// auth types
export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UpdateUserRequest {
    name?: string;
    role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
    avatar?: string;
}