import express from 'express';
import { body } from 'express-validator';

import { login } from '../controllers/user';

export class UserRoute {
  public routes(baseUrl = '', app: express.Application): void {
    app
      .route(`${baseUrl}/login`)
      .post(body('username').exists(), body('password').exists(), login);
  }
}
