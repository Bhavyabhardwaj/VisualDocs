import { CustomError } from './customError';

export class ForbiddenError extends CustomError {
  statusCode = 403;
  isOperational = true;

  constructor(public message: string = 'Forbidden') {
    super(message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
