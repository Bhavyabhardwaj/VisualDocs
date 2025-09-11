import { CustomError } from './customError';

export class ValidationError extends CustomError {
  statusCode = 400;
  isOperational = true;

  constructor(
    public errors: Array<{ message: string; field?: string }>
  ) {
    const message = errors.map(err => err.message).join(', ');
    super(message);
  }

  serializeErrors() {
    return this.errors;
  }
}
