import { InvalidPriceError } from '../exceptions/InvalidPriceError';
import { InvalidQuantityError } from '../exceptions/InvalidQuantityError';
import {
  InvalidDescription,
  InvalidName
} from '../exceptions/InvalidTextError';

export class Product {
  private productPrice = 0;
  private productQuantity = 0;
  private productName = '';
  private productDescription = '';
  constructor(
    name: string,
    description: string,
    quantity: number,
    price: number
  ) {
    this.name = name;
    this.description = description;
    this.quantity = quantity;
    this.price = price;
  }

  get quantity(): number {
    return this.productQuantity;
  }

  set quantity(quantity: number) {
    if (quantity < 0) throw new InvalidQuantityError();
    this.productQuantity = Number(quantity.toFixed()); // expect only integers
  }

  get price(): number {
    return this.productPrice;
  }

  set price(price: number) {
    if (price < 0) throw new InvalidPriceError();
    this.price = Number(price.toFixed(2)); // round up to 2 decimal places
  }

  get name(): string {
    return this.productName;
  }

  set name(name: string) {
    if (name.length < 1) throw new InvalidName('Name');
    this.productName = name;
  }

  get description(): string {
    return this.productDescription;
  }

  set description(desc: string) {
    if (desc.length < 5) throw new InvalidDescription('Description');
    this.description = desc;
  }
}
