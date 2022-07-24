import express from 'express';
import { body } from 'express-validator';

import * as coinController from '../controllers/coin';
import { auth } from '../middleware/auth';
import { CoinType } from '../models/enums/CoinType';

const errorMessage = 'Please provide only integer values';

export class CoinRoute {
  public routes(baseUrl = '', app: express.Application): void {
    app.route(`${baseUrl}/admin/coins`).get(auth, coinController.getCoins);
    app
      .route(`${baseUrl}/admin/coins`)
      .patch(
        auth,
        body(CoinType.Dollar).isInt().withMessage(errorMessage),
        body(CoinType.HalfDollar).isInt().withMessage(errorMessage),
        body(CoinType.Quarter).isInt().withMessage(errorMessage),
        body(CoinType.Dime).isInt().withMessage(errorMessage),
        body(CoinType.Nickel).isInt().withMessage(errorMessage),
        body(CoinType.Penny).isInt().withMessage(errorMessage),
        coinController.loadCoins
      );
  }
}
