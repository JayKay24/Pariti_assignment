import express from 'express';
import { body } from 'express-validator';

import { getCoins, loadCoins } from '../controllers/coin';
import { auth } from '../middleware/auth';
import { CoinType } from '../models/enums/CoinType';

const errorMessage = 'Please provide only integer values';

export class CoinRoute {
  public routes(baseUrl = '', app: express.Application): void {
    app.route(`${baseUrl}/admin/coins`).get(auth, getCoins);
    app
      .route(`${baseUrl}/admin/coins`)
      .put(
        auth,
        body(CoinType.Dollar).exists().isInt().withMessage(errorMessage),
        body(CoinType.HalfDollar).exists().isInt().withMessage(errorMessage),
        body(CoinType.Quarter).exists().isInt().withMessage(errorMessage),
        body(CoinType.Dime).exists().isInt().withMessage(errorMessage),
        body(CoinType.Nickel).exists().isInt().withMessage(errorMessage),
        body(CoinType.Penny).exists().isInt().withMessage(errorMessage),
        loadCoins
      );
  }
}
