export class ProductNotFoundError extends Error {
  constructor(missingProduct: string) {
    const message = `Product ${missingProduct} not found.`;
    super(message);
  }
}
