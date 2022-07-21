import { Product } from './Product';
import { validProduct1, invalidProduct } from '../utils/product';

describe('Product', () => {
  it('should create a valid product', () => {
    const product = new Product(
      validProduct1.name,
      validProduct1.description,
      validProduct1.quantity,
      validProduct1.price
    );

    const expectedPriceValidProduct1 = 12.23;

    expect(product.name).toBe(validProduct1.name);
    expect(product.description).toBe(validProduct1.description);
    expect(product.price).toBe(expectedPriceValidProduct1);
    expect(product.quantity).toBe(validProduct1.quantity);
  });

  it('should throw exceptions on invalid arguments', () => {
    const throwWithInvalidName = () =>
      new Product(
        invalidProduct.name,
        validProduct1.description,
        validProduct1.quantity,
        validProduct1.price
      );

    const throwWithInvalidQuantity = () =>
      new Product(
        validProduct1.name,
        validProduct1.description,
        invalidProduct.quantity,
        validProduct1.price
      );

    const throwWithInvalidPrice = () =>
      new Product(
        validProduct1.name,
        validProduct1.description,
        validProduct1.quantity,
        invalidProduct.price
      );

    const throwWithInvalidDescription = () =>
      new Product(
        validProduct1.name,
        invalidProduct.description,
        validProduct1.quantity,
        validProduct1.price
      );

    expect(throwWithInvalidName).toThrow(
      /name length must not be less than 0/i
    );
    expect(throwWithInvalidQuantity).toThrow(
      /quantity must not be less than 0/i
    );
    expect(throwWithInvalidPrice).toThrow(/price must not be less than 0/i);
    expect(throwWithInvalidDescription).toThrow(
      /description length must not be less than 0/i
    );
  });
});
