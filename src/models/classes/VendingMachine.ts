import { CoinType } from '../enums/CoinType';
import { CentValue } from '../enums/CentValue';

import { CoinChange } from '../contracts/CoinChange';
import { CoinPayload } from '../contracts/CoinPayload';

import { ProductNotFoundError } from '../exceptions/ProductNotFoundError';
import { InsufficientCoinsError } from '../exceptions/InsufficientCoinsError';
import { InsufficientAmountError } from '../exceptions/InsufficientAmountError';
import { InvalidCoinAmountError } from '../exceptions/InvalidCoinAmountError';

import { ProductSlot } from './ProductSlot';
import { DuplicateProductError } from '../exceptions/DuplicateProductError';
import { sanitizeString } from '../../utils/string-sanitizer';
import { sanitizeAmount } from '../../utils/amount-sanitizer';
import { sanitizeCoinPayload } from '../../utils/coin-payload-sanitizer';

export class VendingMachine {
  // ProductSlot implicitly contains products.
  private products: Map<string, ProductSlot>;
  private coffer: Map<CoinType, number>;
  private totalAmountOfCents: number;
  private static instance: VendingMachine;
  // Enforce an upper limit for physical machine
  static MAX_SLOT_AMOUNT_FOR_EACH_COINTYPE = 100;

  // prevent construction of new VendingMachine objects to avoid
  // mistakes
  private constructor() {
    this.products = new Map();
    this.coffer = new Map();
    this.totalAmountOfCents = 0;

    this.coffer.set(CoinType.Dollar, 0);
    this.coffer.set(CoinType.HalfDollar, 0);
    this.coffer.set(CoinType.Quarter, 0);
    this.coffer.set(CoinType.Dime, 0);
    this.coffer.set(CoinType.Nickel, 0);
    this.coffer.set(CoinType.Penny, 0);
  }

  // VendingMachine should be a Singleton throughout the
  // entire lifecycle of the service
  static getInstance() {
    if (!VendingMachine.instance) {
      VendingMachine.instance = new VendingMachine();
    }

    return VendingMachine.instance;
  }

  get totalCents(): number {
    return this.totalAmountOfCents;
  }

  /**
   * Returns mapping of CoinType to amount
   * @returns map of all coin types and amount of each
   */
  getCoffer(): Map<CoinType, number> {
    return this.coffer;
  }

  /**
   * Return the current amount of coins for the given CoinType
   * @param coin
   * @returns current amount of coins for given CoinType
   */
  getCoinAmount(coin: CoinType): number {
    return <number>this.coffer.get(coin);
  }

  /**
   * Return an array of all the products in the VendingMachine's inventory
   *
   * @returns an array of products in their insertion orderr
   */
  getProducts(): ProductSlot[] {
    return [...this.products.values()];
  }

  /**
   * Return the product matching the name
   * @param name
   *
   * @returns product matching name
   */
  getProduct(name: string): ProductSlot {
    const sanitizedName = sanitizeString(name);
    if (this.products.has(sanitizedName)) {
      return <ProductSlot>this.products.get(sanitizedName);
    } else {
      throw new ProductNotFoundError(name);
    }
  }

  /**
   * Add Product to Vending Machine
   * @param product
   */
  addProduct(product: ProductSlot): void {
    const sanitizedName = sanitizeString(product.name);
    if (this.products.has(sanitizedName)) throw new DuplicateProductError();
    this.products.set(sanitizedName, product);
  }

  /**
   * Remove Product from Vending Machine
   * @param name
   */
  removeProduct(name: string): void {
    const sanitizedName = sanitizeString(name);
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
  incrementProductQuantity(name: string, amount: number): ProductSlot {
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
  decrementProductQuantity(name: string, amount: number): ProductSlot {
    const product = this.getProduct(name);
    product.quantity -= amount;
    if (product.quantity === 0) this.removeProduct(product.name);

    return product;
  }

  /**
   * Update the price of a product with a valid price
   * @param name
   * @param newPrice
   *
   * @returns updated product
   */
  updateProductPrice(name: string, newPrice: number): ProductSlot {
    const product = this.getProduct(name);
    product.price = newPrice;

    return product;
  }

  /**
   * Increase amount of coins in the coffer of type CoinType
   * @param coin
   * @param amount
   */
  incrementCoins(coin: CoinType, amount: number): void {
    if (this.coffer.has(coin)) {
      const sanitizedAmount = sanitizeAmount(amount);
      const previousAmount = <number>this.coffer.get(coin);

      const newAmount = previousAmount + sanitizedAmount;
      if (newAmount < 0) throw new InvalidCoinAmountError();
      if (newAmount > VendingMachine.MAX_SLOT_AMOUNT_FOR_EACH_COINTYPE) {
        this.coffer.set(coin, VendingMachine.MAX_SLOT_AMOUNT_FOR_EACH_COINTYPE);
      } else {
        this.coffer.set(coin, newAmount);
      }

      const centValue = sanitizedAmount * CentValue[coin];
      this.totalAmountOfCents += centValue;
    }
  }

  /**
   * Decrease amount of coins in the coffer of type CoinType
   * @param coin
   * @param amount
   */
  decrementCoins(coin: CoinType, amount: number): void {
    if (this.coffer.has(coin)) {
      const sanitizedAmount = sanitizeAmount(amount);
      const previousAmount = <number>this.coffer.get(coin);

      if (sanitizedAmount > previousAmount) {
        throw new InsufficientCoinsError();
      } else {
        const newAmount = previousAmount - sanitizedAmount;
        this.coffer.set(coin, newAmount);
      }

      const centValue = sanitizedAmount * CentValue[coin];
      this.totalAmountOfCents -= centValue;
    }
  }

  /**
   * Empty the Vending Machine Coffer
   * @param coin
   */
  emptyCoffer(): void {
    this.coffer.clear();
    this.prepareCoffer();
    this.totalAmountOfCents = 0;
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
    const splitPrice = productPrice.toString().split('.');

    if (splitPrice.length > 1) {
      const [dollars, cents] = splitPrice;
      resultCents += parseInt(dollars) * CentValue.Dollar;
      resultCents += parseInt(cents);
    } else {
      const dollars = splitPrice[0];
      resultCents += parseInt(dollars) * CentValue.Dollar;
    }

    return resultCents;
  }

  private convertCoinPayloadToCents(payload: CoinPayload): number {
    const sanitizedPayload = sanitizeCoinPayload(payload);
    let resultCents = 0;
    const { Dollar, HalfDollar, Quarter, Dime, Nickel, Penny } =
      sanitizedPayload;

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

    const changeInCents = centsGiven - productCents;

    const expectedChange = this.computeChangeWithFewestCents(changeInCents);

    const validChange = this.extractCoinsFromCoffer(expectedChange);

    return validChange;
  }

  /**
   * Validate that the coffer has the available coins to
   * return the correct change
   * @param coinsToExtract
   *
   * @returns object mapping each coin type to amount
   */
  private extractCoinsFromCoffer(coinsToExtract: CoinChange): CoinChange {
    const coinsToExtractKeys = Object.keys(coinsToExtract);
    for (const key of coinsToExtractKeys) {
      this.decrementCoins(<CoinType>key, coinsToExtract[<CoinType>key]);
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
   * Initialize coin values to zero
   */
  private prepareCoffer(): void {
    this.coffer.set(CoinType.Dollar, 0);
    this.coffer.set(CoinType.HalfDollar, 0);
    this.coffer.set(CoinType.Quarter, 0);
    this.coffer.set(CoinType.Dime, 0);
    this.coffer.set(CoinType.Nickel, 0);
    this.coffer.set(CoinType.Penny, 0);
  }

  /**
   * Resets the Vending Machine for testing purposes.
   *
   */
  public ResetInventory() {
    this.products.clear();
    this.coffer.clear();

    this.prepareCoffer();

    this.totalAmountOfCents = 0;
  }
}
