import { CoinPayload } from '../contracts/CoinPayload';
import { CoinType } from '../enums/CoinType';
import { sanitizeAmount } from './amount-sanitizer';

export function sanitizeCoinPayload(payload: CoinPayload): CoinPayload {
  const sanitizedPayload: CoinPayload = {
    [CoinType.Dollar]: 0,
    [CoinType.HalfDollar]: 0,
    [CoinType.Quarter]: 0,
    [CoinType.Dime]: 0,
    [CoinType.Nickel]: 0,
    [CoinType.Penny]: 0
  };

  for (const [coinType, amount] of Object.entries(payload)) {
    switch (coinType) {
      case CoinType.Dollar:
        sanitizedPayload[CoinType.Dollar] = sanitizeAmount(amount);
        break;
      case CoinType.HalfDollar:
        sanitizedPayload[CoinType.HalfDollar] = sanitizeAmount(amount);
        break;
      case CoinType.Quarter:
        sanitizedPayload[CoinType.Quarter] = sanitizeAmount(amount);
        break;
      case CoinType.Dime:
        sanitizedPayload[CoinType.Dime] = sanitizeAmount(amount);
        break;
      case CoinType.Nickel:
        sanitizedPayload[CoinType.Nickel] = sanitizeAmount(amount);
        break;
      case CoinType.Penny:
        sanitizedPayload[CoinType.Penny] = sanitizeAmount(amount);
        break;
    }
  }

  return sanitizedPayload;
}
