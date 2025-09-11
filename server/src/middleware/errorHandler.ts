import type { NextFunction } from "express";
import type { Request, Response } from "express";
import logger from "../utils/logger";
import { errorResponse } from "../utils";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error('error occurred: ', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
    });

    return errorResponse(
        res,
        process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
        '500'
    );
}