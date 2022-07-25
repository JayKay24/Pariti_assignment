import { NextFunction, Request, Response } from 'express';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import { RequestError } from '../errorHandler';
import authentication from '../config/authentication.json';

export interface CustomRequest extends Request {
  user: string | JwtPayload;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    throw new RequestError(401, 'Not Authenticated');
  }

  const unvalidated = <string>req.get('Authorization');
  const [, token] = unvalidated.split(' ');

  try {
    jsonwebtoken.verify(token, authentication.secret);
  } catch (error) {
    throw new RequestError(500, 'Something went wrong');
  }

  next();
};
