import { CoinPayload } from '../contracts/CoinPayload';
import { CoinType } from '../enums/CoinType';

const coinsToLoad: CoinPayload = {
  [CoinType.Dollar]: 2,
  [CoinType.HalfDollar]: 2,
  [CoinType.Quarter]: 2,
  [CoinType.Dime]: 2,
  [CoinType.Nickel]: 2,
  [CoinType.Penny]: 100
};

const invalidCoinsToLoad: CoinPayload = {
  [CoinType.Dollar]: 1000,
  [CoinType.HalfDollar]: 0,
  [CoinType.Quarter]: -30,
  [CoinType.Dime]: -90,
  [CoinType.Nickel]: -10,
  [CoinType.Penny]: 0
};

export { coinsToLoad, invalidCoinsToLoad };
