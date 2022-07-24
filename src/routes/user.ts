import express from 'express';

import { login } from '../controllers/user';

export class UserRoute {
  public routes(baseUrl = '', app: express.Application): void {
    app.route(`${baseUrl}/login`).post(login);
  }
}
