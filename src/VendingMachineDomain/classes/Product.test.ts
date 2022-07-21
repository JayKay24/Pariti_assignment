import { Product } from './Product';

const validProduct1 = {
  name: 'JuiceBox',
  description: 'Orange Juice',
  price: 12.2345,
  quantity: 10
};

const validProduct2 = {
  name: 'Crisps',
  description: 'Potato crisps',
  price: 10.48,
  quantity: 5
};

describe('Product', () => {
  it('should create a valid product', () => {
    const product1 = new Product(
      validProduct1.name,
      validProduct1.description,
      validProduct1.quantity,
      validProduct1.price
    );

    const expectedPriceValidProduct1 = 12.23;

    expect(product1.name).toBe(validProduct1.name);
    expect(product1.description).toBe(validProduct1.description);
    expect(product1.price).toBe(expectedPriceValidProduct1);
    expect(product1.quantity).toBe(validProduct1.quantity);
  });
});
