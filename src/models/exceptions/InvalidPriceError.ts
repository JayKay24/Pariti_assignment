export class InvalidPriceError extends Error {
  constructor() {
    const defaultMessage = 'Price must not be less than 0';
    super(defaultMessage);
  }
}
