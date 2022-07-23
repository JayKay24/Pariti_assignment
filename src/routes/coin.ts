import express from 'express';

import * as coinController from '../controllers/coin';
import { auth } from '../middleware/auth';

export class CoinRoute {
  public routes(baseUrl = '', app: express.Application): void {
    app.route(`${baseUrl}/admin/coins`).get(auth, coinController.getCoins);
    app.route(`${baseUrl}/admin/coins`).patch(auth, coinController.loadCoins);
  }
}
