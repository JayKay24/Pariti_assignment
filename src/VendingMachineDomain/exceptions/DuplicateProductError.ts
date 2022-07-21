export class DuplicateProductError extends Error {
  constructor() {
    const defaultMessage = 'Product already exists';
    super(defaultMessage);
  }
}
