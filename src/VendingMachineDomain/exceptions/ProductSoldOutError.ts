export class ProductSoldOutError extends Error {
  constructor() {
    const defaultMessage = 'Product Sold out';
    super(defaultMessage);
  }
}
