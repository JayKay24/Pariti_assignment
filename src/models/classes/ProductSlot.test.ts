import { ProductSlot } from './ProductSlot';
import { validProduct1, invalidProduct } from '../../utils/product';
import { sanitizeString } from '../../utils/string-sanitizer';

describe('ProductSlot', () => {
  it('should create a valid product', () => {
    const product = new ProductSlot(
      validProduct1.name,
      validProduct1.description,
      validProduct1.quantity,
      validProduct1.price
    );

    const expectedPriceValidProduct1 = 2.23;

    expect(product.name).toBe(sanitizeString(validProduct1.name));
    expect(product.description).toBe(validProduct1.description);
    expect(product.price).toBe(expectedPriceValidProduct1);
    expect(product.quantity).toBe(validProduct1.quantity);
  });

  it('should throw exceptions on invalid arguments', () => {
    const throwWithInvalidName = () =>
      new ProductSlot(
        invalidProduct.name,
        validProduct1.description,
        validProduct1.quantity,
        validProduct1.price
      );

    const throwWithInvalidQuantity = () =>
      new ProductSlot(
        validProduct1.name,
        validProduct1.description,
        invalidProduct.quantity,
        validProduct1.price
      );

    const throwWithInvalidPrice = () =>
      new ProductSlot(
        validProduct1.name,
        validProduct1.description,
        validProduct1.quantity,
        invalidProduct.price
      );

    const throwWithInvalidDescription = () =>
      new ProductSlot(
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
