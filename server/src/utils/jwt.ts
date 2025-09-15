import type { JwtPayload, TokenPair } from "../types";
import jwt, { type Jwt } from "jsonwebtoken";

// create token without iat(issued at) and expiry
export const generateAccessToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '30d' }
  );
};

export const generateTokenPair = (user: {
    id: string;
    email: string;
    name: string;
    role: string;
}): TokenPair => {
    return {
        accessToken: generateAccessToken({
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }),
        refreshToken: generateRefreshToken(user.id),
        expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
    };
}

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
};

export const verifyRefreshToken = (token: string): { userId: string; type: string } => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { userId: string; type: string };
};