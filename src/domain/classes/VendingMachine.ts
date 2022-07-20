import { CoinType } from '../enums/CoinType';
import { CoinChange } from '../interfaces/CoinChange';
import { CoinPayload } from '../interfaces/CoinPayload';
import { Product } from './Product';

export class VendingMachine {
  private products: Map<string, Product>;
  private coins: Map<CoinType, number>;
  private totalCents: number;

  constructor() {
    this.products = new Map();
    this.coins = new Map();
    this.totalCents = 0;
  }

  /**
   * Add Product to Vending Machine
   * @param product
   */
  addProduct(product: Product): void {
    this.products.set(product.name, product);
  }

  /**
   * Increase amount of coins of type CoinType
   * @param coin
   * @param amount
   */
  addCoins(coin: CoinType, amount: number): void {
    if (this.coins.has(coin)) {
      const previousAmount = this.coins.get(coin) || 0;
      this.coins.set(coin, previousAmount + amount);
    } else {
      this.coins.set(coin, amount);
    }

    this.totalCents += amount;
  }

  /**
   * Decrease amount of coins of type CoinType
   * @param coin
   * @param amount
   */
  removeCoins(coin: CoinType, amount: number): void {
    if (this.coins.has(coin)) {
      const previousAmount = this.coins.get(coin) || 0;
      if (amount > previousAmount) {
        throw new Error('Not Enough Coins');
      }
    }
  }

  /**
   * Facilitate purchase of product of given name by customer
   * @param coins
   * @param name
   */
  // buyProduct(coins: CoinPayload, name: string): CoinChange {}

  // private convertPriceToCents(product: Product): number {}

  // private convertCoinPayloadToCents(payload: CoinPayload): number {}

  // private calculateChange(cents: number): number {}
}
