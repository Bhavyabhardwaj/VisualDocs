export * from './authValidation';
export * from './projectValidation';
export * from './oauthValidation';
export * from './githubValidation';
export * from './payment.validation';

import type { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { ValidationError } from '../errors';


export const validate = (schema: ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        throw new ValidationError(validationErrors);
      }
      next(error);
    }
  };
