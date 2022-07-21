import { CoinType } from '../enums/CoinType';
import { CentValue } from '../enums/CentValue';

import { CoinChange } from '../contracts/CoinChange';
import { CoinPayload } from '../contracts/CoinPayload';

import { ProductNotFoundError } from '../exceptions/ProductNotFoundError';
import { InsufficientCoinsError } from '../exceptions/InsufficientCoinsError';
import { InsufficientAmountError } from '../exceptions/InsufficientAmountError';

import { Product } from './Product';
import { DuplicateProductError } from '../exceptions/DuplicateProductError';
import { stringSanitizer } from '../utils/string-sanitizer';

export class VendingMachine {
  private products: Map<string, Product>;
  private coins: Map<CoinType, number>;
  private totalCents: number;
  private static instance: VendingMachine;

  // prevent construction of new VendingMachine objects to avoid
  // mistakes
  private constructor() {
    this.products = new Map();
    this.coins = new Map();
    this.totalCents = 0;
  }

  // VendingMachine should be a Singleton throughout the
  // entire lifecycle of the service
  static getInstance() {
    if (!VendingMachine.instance) {
      VendingMachine.instance = new VendingMachine();
    }

    return VendingMachine.instance;
  }

  /**
   * Return an array of all the products in the VendingMachine's inventory
   *
   * @returns an array of products in their insertion orderr
   */
  getProducts(): Product[] {
    return [...this.products.values()];
  }

  /**
   * Return the product matching the name
   * @param name
   *
   * @returns product matching name
   */
  getProduct(name: string): Product {
    const sanitizedName = stringSanitizer(name);
    if (this.products.has(sanitizedName)) {
      return <Product>this.products.get(sanitizedName);
    } else {
      throw new ProductNotFoundError(name);
    }
  }

  /**
   * Add Product to Vending Machine
   * @param product
   */
  addProduct(product: Product): void {
    const sanitizedName = stringSanitizer(product.name);
    if (this.products.has(sanitizedName)) throw new DuplicateProductError();
    this.products.set(sanitizedName, product);
  }

  /**
   * Remove Product from Vending Machine
   * @param name
   */
  removeProduct(name: string): void {
    const sanitizedName = stringSanitizer(name);
    if (this.products.has(sanitizedName)) {
      this.products.delete(sanitizedName);
    } else {
      throw new ProductNotFoundError(name);
    }
  }

  /**
   * Increase the product quantity by the given amount
   * @param name
   * @param amount
   * @returns updated product
   */
  incrementProductQuantity(name: string, amount: number): Product {
    const product = this.getProduct(name);
    product.quantity += amount;

    return product;
  }

  /**
   * Decrease the product quantity by the given amount
   * @param name
   * @param amount
   * @returns updated product
   */
  decrementProductQuantity(name: string, amount: number): Product {
    const product = this.getProduct(name);
    product.quantity -= amount;

    return product;
  }

  /**
   * Update the price of a product with a valid price
   * @param name
   * @param newPrice
   *
   * @returns updated product
   */
  updateProductPrice(name: string, newPrice: number): Product {
    const product = this.getProduct(name);
    product.price = newPrice;

    return product;
  }

  /**
   * Increase amount of coins of type CoinType
   * @param coin
   * @param amount
   */
  loadCoins(coin: CoinType, amount: number): void {
    if (this.coins.has(coin)) {
      const previousAmount = <number>this.coins.get(coin);

      this.coins.set(coin, previousAmount + amount);

      const centValue = amount * CentValue[coin];
      this.totalCents += centValue;
    }
  }

  /**
   * Decrease amount of coins of type CoinType
   * @param coin
   * @param amount
   */
  decrementCoins(coin: CoinType, amount: number): void {
    if (this.coins.has(coin)) {
      const previousAmount = <number>this.coins.get(coin);

      if (amount > previousAmount) {
        throw new InsufficientCoinsError();
      } else {
        const newAmount = previousAmount - amount;
        this.coins.set(coin, newAmount);
      }

      const centValue = amount * CentValue[coin];
      this.totalCents -= centValue;
    }
  }

  /**
   * Facilitate purchase of product of given name by customer
   * @param coins
   * @param name
   */
  buyProduct(coins: CoinPayload, name: string): CoinChange {
    const product = this.getProduct(name);
    const amountGiven = this.convertCoinPayloadToCents(coins);
    const productPice = this.convertProductPriceToCents(product.price);

    // eslint-disable-next-line no-useless-catch
    try {
      const change = this.calculateChange(amountGiven, productPice);
      this.decrementProductQuantity(name, 1);
      return change;
    } catch (error) {
      throw error;
    }
  }

  private convertProductPriceToCents(productPrice: number): number {
    let resultCents = 0;
    const [dollars, cents] = productPrice.toString().split('.');
    resultCents += parseInt(dollars) * CentValue.Dollar;
    resultCents += parseInt(cents);

    return resultCents;
  }

  private convertCoinPayloadToCents(payload: CoinPayload): number {
    let resultCents = 0;
    const { Dollar, HalfDollar, Quarter, Dime, Nickel, Penny } = payload;

    resultCents += Dollar * CentValue.Dollar;
    resultCents += HalfDollar * CentValue.HalfDollar;
    resultCents += Quarter * CentValue.Quarter;
    resultCents += Dime * CentValue.Dime;
    resultCents += Nickel * CentValue.Nickel;
    resultCents += Penny * CentValue.Penny;

    return resultCents;
  }

  /**
   * Calculate the change in cents to give back to the customer
   * @param centsGiven
   * @param productCents
   */
  private calculateChange(
    centsGiven: number,
    productCents: number
  ): CoinChange {
    if (centsGiven < productCents) {
      throw new InsufficientAmountError();
    }

    const expectedChange = this.computeChangeWithFewestCents(
      centsGiven - productCents
    );

    const validChange = this.extractCoinsFromMachine(expectedChange);

    return validChange;
  }

  /**
   * Validate that the vending machine has the available coins to
   * return the correct change
   * @param coinsToExtract
   *
   * @returns object mapping each coin type to amount
   */
  private extractCoinsFromMachine(coinsToExtract: CoinChange): CoinChange {
    for (const [coinType, amount] of Object.entries(coinsToExtract)) {
      switch (coinType) {
        case CoinType.Dollar:
          this.decrementCoins(CoinType.Dollar, amount);
          break;
        case CoinType.HalfDollar:
          this.decrementCoins(CoinType.HalfDollar, amount);
          break;
        case CoinType.Quarter:
          this.decrementCoins(CoinType.Quarter, amount);
          break;
        case CoinType.Dime:
          this.decrementCoins(CoinType.Dime, amount);
          break;
        case CoinType.Nickel:
          this.decrementCoins(CoinType.Nickel, amount);
          break;
        case CoinType.Penny:
          this.decrementCoins(CoinType.Penny, amount);
          break;
      }
    }
    return coinsToExtract;
  }

  /**
   * Return the change to the customer with fewest coins
   * @param cents
   *
   * @returns object mapping each coin type to amount
   */
  private computeChangeWithFewestCents(cents: number): CoinChange {
    const resultingChange: CoinChange = {
      [CoinType.Dollar]: 0,
      [CoinType.HalfDollar]: 0,
      [CoinType.Quarter]: 0,
      [CoinType.Dime]: 0,
      [CoinType.Nickel]: 0,
      [CoinType.Penny]: 0
    };

    resultingChange.Dollar = Math.floor(cents / CentValue.Dollar);
    cents %= CentValue.Dollar;

    resultingChange.HalfDollar = Math.floor(cents / CentValue.HalfDollar);
    cents %= CentValue.HalfDollar;

    resultingChange.Quarter = Math.floor(cents / CentValue.Quarter);
    cents %= CentValue.Quarter;

    resultingChange.Dime = Math.floor(cents / CentValue.Dime);
    cents %= CentValue.Dime;

    resultingChange.Nickel = Math.floor(cents / CentValue.Nickel);
    cents %= CentValue.Nickel;

    resultingChange.Penny = Math.floor(cents / CentValue.Penny);
    cents %= CentValue.Penny;

    return resultingChange;
  }

  /**
   * Resets the Vending Machine for testing purposes.
   *
   */
  public clearInventory() {
    this.products.clear();
    this.coins.clear();
    this.totalCents = 0;
  }
}
