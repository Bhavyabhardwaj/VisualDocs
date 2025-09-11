import { CustomError } from './customError';

export class BadRequestError extends CustomError {
  statusCode = 400;
  isOperational = true;

  constructor(message: string = 'Bad request') {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
