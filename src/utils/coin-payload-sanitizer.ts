import { CoinPayload } from '../models/contracts/CoinPayload';
import { CoinType } from '../models/enums/CoinType';
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
    sanitizedPayload[<CoinType>coinType] = sanitizeAmount(amount);
  }

  return sanitizedPayload;
}
