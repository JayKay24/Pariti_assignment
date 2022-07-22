import { CoinType } from '../enums/CoinType';

export type CoinPayload = {
  [coin in CoinType]: number;
};
