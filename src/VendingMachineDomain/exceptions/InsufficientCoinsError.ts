export class InsufficientCoinsError extends Error {
  constructor() {
    const defaultMessage = 'Not Enough coins';
    super(defaultMessage);
  }
}
