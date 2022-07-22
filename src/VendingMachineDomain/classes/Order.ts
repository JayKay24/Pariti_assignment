import { CoinChange } from '../contracts/CoinChange';

export class Order {
  constructor(
    public name: string,
    public description: string,
    public price: number,
    public change: CoinChange
  ) {}
}
