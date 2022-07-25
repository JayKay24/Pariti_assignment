export class InvalidCoinAmountError extends Error {
  constructor() {
    const defaultMessage = 'Coin amount must not be less than 0';
    super(defaultMessage);
  }
}
