import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validator';

export class RequestError extends Error {
  statusCode: number;
  constructor(status = 500, message: string) {
    super(message);
    this.statusCode = status;
  }
}

export class ExpressValidatorError extends Error {
  statusCode: number;
  errors: ValidationError[];
  constructor(status = 500, errors: ValidationError[]) {
    super();
    this.statusCode = status;
    this.errors = errors;
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  let status: number;

  if (err instanceof RequestError) {
    status = err.statusCode;
    const message = err.message;
    return res.status(status).send({ error: message });
  } else if (err instanceof ExpressValidatorError) {
    status = err.statusCode;
    const errors = err.errors;
    return res.status(status).send({ errors });
  }

  status = 500;

  const message = err.message;
  res.status(status).send({ error: message });
};
