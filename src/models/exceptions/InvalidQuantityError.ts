export class InvalidQuantityError extends Error {
  constructor() {
    const defaultMessage = 'Quantity must not be less than 0';
    super(defaultMessage);
  }
}
