import { NextFunction, Request, Response } from 'express';

export class RequestError extends Error {
  statusCode: number;
  constructor(status = 500, message: string) {
    super(message);
    this.statusCode = status;
  }
}

export const errorHandler = (
  err: RequestError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.message;
  res.status(status).send({ error: message });
};
