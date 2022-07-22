export class InsufficientCoinsError extends Error {
  constructor() {
    const defaultMessage = 'Not Enough coins in the machine to make change';
    super(defaultMessage);
  }
}
