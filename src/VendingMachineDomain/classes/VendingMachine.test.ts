import { VendingMachine } from './VendingMachine';
import { Product } from './Product';
import { validProduct1, validProduct2 } from '../utils/product';

describe('VendingMachine', () => {
  // Clear the Singleton state before each test case
  beforeEach(() => VendingMachine.getInstance().clearInventory());

  it('VendingMachine is a Singleton', () => {
    expect(VendingMachine.getInstance()).toBe(VendingMachine.getInstance());
  });

  it('adds products to inventory', () => {
    const VendingMach = VendingMachine.getInstance();

    const product1 = new Product(
      validProduct1.name,
      validProduct1.description,
      validProduct1.quantity,
      validProduct1.price
    );

    const product2 = new Product(
      validProduct2.name,
      validProduct2.description,
      validProduct2.quantity,
      validProduct1.price
    );

    VendingMach.addProduct(product1);
    VendingMach.addProduct(product2);

    const [prod1, prod2] = VendingMach.getProducts();

    expect(prod1).toBe(product1);
    expect(prod2).toBe(product2);
  });

  it('removes a product from inventory', () => {
    const VendingMach = VendingMachine.getInstance();

    expect(() => VendingMach.removeProduct('abc')).toThrow(
      /product abc not found/i
    );

    const product = new Product(
      validProduct1.name,
      validProduct1.description,
      validProduct1.quantity,
      validProduct1.price
    );

    VendingMach.addProduct(product);
    const [prod1] = VendingMach.getProducts();
    expect(prod1).toBe(product);

    VendingMach.removeProduct(prod1.name);
    expect(VendingMach.getProducts().length).toBe(0);
  });
});
