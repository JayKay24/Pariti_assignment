import express from 'express';

import * as coinController from '../controllers/coin';

export class CoinRoute {
  public routes(app: express.Application): void {
    app.route('/api/v1/coins').get(coinController.getCoins);
    app.route('/api/v1/coins').patch(coinController.loadCoins);
  }
}
