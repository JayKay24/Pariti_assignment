import { VendingMachine } from './VendingMachine';
import { Product } from './Product';
import { CoinType } from '../enums/CoinType';
import { validProduct1, validProduct2 } from '../utils/product';
import { sanitizeString } from '../utils/string-sanitizer';
import { coinsToLoad, invalidCoinsToLoad } from '../utils/coins';
import { CoinPayload } from '../contracts/CoinPayload';

describe('VendingMachine', () => {
  // Clear the Singleton state before each test case
  beforeEach(() => VendingMachine.getInstance().ResetInventory());

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
      sanitizeString(validProduct1.name)
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
      20,
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

  it('should load given coins of a particular type into the Vending machine', () => {
    const VendingMach = VendingMachine.getInstance();

    VendingMach.loadCoins(CoinType.Dollar, coinsToLoad.Dollar);
    VendingMach.loadCoins(CoinType.HalfDollar, coinsToLoad.HalfDollar);
    VendingMach.loadCoins(CoinType.Penny, coinsToLoad.Penny);

    expect(VendingMach.getCoinAmount(CoinType.Dollar)).toEqual(
      coinsToLoad.Dollar
    );
    expect(VendingMach.getCoinAmount(CoinType.HalfDollar)).toEqual(
      coinsToLoad.HalfDollar
    );
    expect(VendingMach.getCoinAmount(CoinType.Penny)).toEqual(
      coinsToLoad.Penny
    );
    expect(VendingMach.totalCents).toEqual(400);
  });

  it('should decrement the amount of coins given CoinType and amount', () => {
    const VendingMach = VendingMachine.getInstance();

    VendingMach.loadCoins(CoinType.Dollar, coinsToLoad.Dollar);
    VendingMach.loadCoins(CoinType.HalfDollar, coinsToLoad.HalfDollar);

    expect(VendingMach.totalCents).toEqual(300);

    expect(() => VendingMach.decrementCoins(CoinType.Dollar, 3)).toThrow(
      /not enough coins/i
    );

    VendingMach.decrementCoins(CoinType.Dollar, coinsToLoad.Dollar);

    expect(VendingMach.getCoinAmount(CoinType.Dollar)).toBe(0);
    expect(VendingMach.totalCents).toBe(100);

    VendingMach.decrementCoins(CoinType.HalfDollar, 1.36);

    expect(VendingMach.getCoinAmount(CoinType.HalfDollar)).toBe(1);
    expect(VendingMach.totalCents).toBe(50);
  });
});

describe('Vending Machine: Buying a product', () => {
  // Clear the Singleton state before each test case
  beforeEach(() => VendingMachine.getInstance().ResetInventory());

  it('should facilitate buying a product', () => {
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

    VendingMach.loadCoins(CoinType.Dollar, coinsToLoad.Dollar);
    VendingMach.loadCoins(CoinType.HalfDollar, coinsToLoad.HalfDollar);
    VendingMach.loadCoins(CoinType.Quarter, coinsToLoad.Quarter);
    VendingMach.loadCoins(CoinType.Dime, coinsToLoad.Dime);
    VendingMach.loadCoins(CoinType.Nickel, coinsToLoad.Nickel);
    VendingMach.loadCoins(CoinType.Penny, coinsToLoad.Penny);

    expect(VendingMach.totalCents).toBe(480);

    const payloadProd1: CoinPayload = {
      [CoinType.Dollar]: 2,
      [CoinType.HalfDollar]: 0,
      [CoinType.Quarter]: 0,
      [CoinType.Dime]: 2,
      [CoinType.Nickel]: 0,
      [CoinType.Penny]: 4
    };

    // product price is $2.23(223 cents) & payload in cents is 224 cents.
    // we expect one penny back & the total cents in inventory reduced by (224 - 223) = 1 cent;
    // Total remaining cents in vending machine should be 479

    expect(() => VendingMach.buyProduct(payloadProd1, 'abc')).toThrow(
      /product abc not found/i
    );

    const change = VendingMach.buyProduct(payloadProd1, product1.name);

    expect(change.Dollar).toBe(0);
    expect(change.HalfDollar).toBe(0);
    expect(change.Quarter).toBe(0);
    expect(change.Dime).toBe(0);
    expect(change.Nickel).toBe(0);
    expect(change.Penny).toBe(1);
    expect(VendingMach.totalCents).toBe(479);
  });

  it('should facilitate buying only with dollars', () => {
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

    VendingMach.loadCoins(CoinType.Dollar, coinsToLoad.Dollar);
    VendingMach.loadCoins(CoinType.HalfDollar, coinsToLoad.HalfDollar);
    VendingMach.loadCoins(CoinType.Quarter, coinsToLoad.Quarter);
    VendingMach.loadCoins(CoinType.Dime, coinsToLoad.Dime);
    VendingMach.loadCoins(CoinType.Nickel, coinsToLoad.Nickel);
    VendingMach.loadCoins(CoinType.Penny, coinsToLoad.Penny);

    expect(VendingMach.totalCents).toBe(480);

    const payloadProd1: CoinPayload = {
      [CoinType.Dollar]: 3,
      [CoinType.HalfDollar]: 0,
      [CoinType.Quarter]: 0,
      [CoinType.Dime]: 0,
      [CoinType.Nickel]: 0,
      [CoinType.Penny]: 0
    };

    // product price is $2.23(223 cents) & payload in cents is 300 cents.
    // we expect one penny back & the total cents in inventory reduced by (300 - 223) = 77 cents;
    // Total remaining cents in vending machine should be 403
    const change = VendingMach.buyProduct(payloadProd1, product1.name);

    expect(change.Dollar).toBe(0);
    expect(change.HalfDollar).toBe(1);
    expect(change.Quarter).toBe(1);
    expect(change.Dime).toBe(0);
    expect(change.Nickel).toBe(0);
    expect(change.Penny).toBe(2);
    expect(VendingMach.totalCents).toBe(403);
  });
});
