import { CoinType } from '../enums/CoinType';
import { CentValue } from '../enums/CentValue';

import { CoinChange } from '../contracts/CoinChange';
import { CoinPayload } from '../contracts/CoinPayload';

import { ProductNotFoundError } from '../exceptions/ProductNotFoundError';
import { InsufficientCoinsError } from '../exceptions/InsufficientCoinsError';
import { InsufficientProducts } from '../exceptions/InsufficientProductsError';
import { ProductSoldOutError } from '../exceptions/ProductSoldOutError';
import { InvalidPriceError } from '../exceptions/InvalidPriceError';
import { InsufficientAmountError } from '../exceptions/InsufficientAmountError';

import { Product } from './Product';

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
   */
  getProducts(): Product[] {
    return [...this.products.values()];
  }

  /**
   * Add Product to Vending Machine
   * @param product
   */
  addProduct(product: Product): void {
    this.products.set(product.name, product);
  }

  /**
   * Remove Product from Vending Machine
   * @param name
   */
  removeProduct(name: string): void {
    if (this.products.has(name)) {
      this.products.delete(name);
    } else {
      throw new ProductNotFoundError(name);
    }
  }

  reduceProductByAmount(name: string, amount: number): void {
    if (this.products.has(name)) {
      const product = <Product>this.products.get(name);
      const { quantity: previousAmount } = product;

      if (previousAmount === 0) {
        throw new ProductSoldOutError();
      } else if (previousAmount < amount) {
        throw new InsufficientProducts(amount);
      } else {
        product.quantity -= amount;
      }
    }
  }

  /**
   * Update the price of a product with a valid price
   * @param name
   * @param newPrice
   */
  updateProductPrice(name: string, newPrice: number): void {
    if (this.products.has(name)) {
      const product = <Product>this.products.get(name);

      if (newPrice < 0) throw new InvalidPriceError();

      product.price = newPrice;
    }
  }

  /**
   * Increase amount of coins of type CoinType
   * @param coin
   * @param amount
   */
  loadCoins(coin: CoinType, amount: number): void {
    if (this.coins.has(coin)) {
      const previousAmount = this.coins.get(coin) || 0;

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
  removeCoins(coin: CoinType, amount: number): void {
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
    if (this.products.has(name)) {
      const amountGiven = this.convertCoinPayloadToCents(coins);
      const product = <Product>this.products.get(name);
      const productPice = this.convertProductPriceToCents(product.price);

      // eslint-disable-next-line no-useless-catch
      try {
        const change = this.calculateChange(amountGiven, productPice);
        return change;
      } catch (error) {
        throw error;
      }
    } else {
      throw new ProductNotFoundError(name);
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
          this.removeCoins(CoinType.Dollar, amount);
          break;
        case CoinType.HalfDollar:
          this.removeCoins(CoinType.HalfDollar, amount);
          break;
        case CoinType.Quarter:
          this.removeCoins(CoinType.Quarter, amount);
          break;
        case CoinType.Dime:
          this.removeCoins(CoinType.Dime, amount);
          break;
        case CoinType.Nickel:
          this.removeCoins(CoinType.Nickel, amount);
          break;
        case CoinType.Penny:
          this.removeCoins(CoinType.Penny, amount);
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
}
