import { CoinType } from '../enums/CoinType';

export type CoinChange = {
  [coinType in CoinType]: number;
};
