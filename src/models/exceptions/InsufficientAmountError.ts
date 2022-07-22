export class InsufficientAmountError extends Error {
  constructor() {
    const defaultMessage = 'Amount given is less than price';
    super(defaultMessage);
  }
}
