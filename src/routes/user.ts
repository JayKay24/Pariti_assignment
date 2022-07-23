import express from 'express';

import * as userController from '../controllers/user';

export class UserRoute {
  public routes(baseUrl = '', app: express.Application): void {
    app.route(`${baseUrl}/login`).post(userController.login);
  }
}
