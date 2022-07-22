import express from 'express';

import * as coinController from '../controllers/coin';

export class CoinRoute {
  public routes(baseUrl = '', app: express.Application): void {
    app.route(`/${baseUrl}/admin/coins`).get(coinController.getCoins);
    app.route(`/${baseUrl}/admin/coins`).patch(coinController.loadCoins);
  }
}
