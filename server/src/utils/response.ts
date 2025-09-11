import type { Response } from "express";

// Standard API response format
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    timestamp: string;
}

// Success response 
export const successResponse = <T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200
) : Response<ApiResponse<T>> => {
    return res.status(statusCode).json({
        success: true,
        data,
        message,
        timestamp: new Date().toISOString()
    });
}

// Error response
export const errorResponse = <T>(
    res: Response,
    error: string,
    message?: string,
    statusCode: number = 400
) : Response<ApiResponse<T>> => {
    return res.status(statusCode).json({
        success: false,
        error,
        message,
        timestamp: new Date().toISOString()
    });
}
