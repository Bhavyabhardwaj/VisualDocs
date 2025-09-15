import type { Response } from 'express';
import type { ApiResponse, PaginatedResponse } from '../types';


export const successResponse = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response<ApiResponse<T>> => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    ...(message && { message }),
  };

  return res.status(statusCode).json(response);
};

export const paginatedResponse = <T>(
  res: Response,
  items: T[],
  pagination: any,
  message?: string
): Response<PaginatedResponse<T>> => {
  const response: PaginatedResponse<T> = {
    success: true,
    data: {
      items,
      pagination
    },
    timestamp: new Date().toISOString(),
    ...(message && { message }),
  };

  return res.status(200).json(response);
};

export const errorResponse = (
  res: Response,
  error: string,
  statusCode: number = 400,
  details?: any
): Response<ApiResponse> => {
  const response: ApiResponse = {
    success: false,
    error,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && details && { details }),
  };

  return res.status(statusCode).json(response);
};
