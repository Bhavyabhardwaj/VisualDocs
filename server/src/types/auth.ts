import type { UserProfile } from "./user";

export interface AuthResponse {
    user: UserProfile;
    token: TokenPair;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    expiresIn: number; 
}

export interface JwtPayload {
    userId: string;
    email: string;
    name: string;
    role: string;
    iat?: number; 
    exp?: number; 
}

export interface RefreshTokenRequest {
  refreshToken: string;
}