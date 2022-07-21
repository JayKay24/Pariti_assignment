import { VendingMachine } from './VendingMachine';
import { Product } from './Product';
import { validProduct1, validProduct2 } from '../utils/product';
import { stringSanitizer } from '../utils/string-sanitizer';

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
    expect(() => VendingMach.addProduct(product2)).toThrow(
      /product already exists/i
    );
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
    expect(() => VendingMach.removeProduct(validProduct1.name)).toThrow(
      `Product ${validProduct1.name} not found.`
    );
  });

  it('gets a single product', () => {
    const VendingMach = VendingMachine.getInstance();

    const product = new Product(
      validProduct1.name,
      validProduct1.description,
      validProduct1.quantity,
      validProduct1.price
    );

    expect(() => VendingMach.getProduct('abc')).toThrow(
      /product abc not found/i
    );

    VendingMach.addProduct(product);

    expect(VendingMach.getProduct(validProduct1.name).name).toBe(
      stringSanitizer(validProduct1.name)
    );
  });

  it('should reduce the product quantity', () => {
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
      validProduct2.price
    );

    VendingMach.addProduct(product1);
    VendingMach.addProduct(product2);

    expect(() =>
      VendingMach.decrementProductQuantity(product1.name, 1000)
    ).toThrow(/quantity must not be less than 0/i);

    VendingMach.incrementProductQuantity(product2.name, 5);

    expect(VendingMach.getProduct(product2.name).quantity).toBe(
      Product.MAX_QUANTITY
    );
  });

  it('should update the product price', () => {
    const VendingMach = VendingMachine.getInstance();

    const product = new Product(
      validProduct1.name,
      validProduct1.description,
      validProduct1.quantity,
      validProduct1.price
    );

    VendingMach.addProduct(product);
    VendingMach.updateProductPrice(product.name, 48.567);

    expect(VendingMach.getProduct(product.name).price).toEqual(48.57);
  });
});
