import { InvalidPriceError } from '../exceptions/InvalidPriceError';
import { InvalidQuantityError } from '../exceptions/InvalidQuantityError';
import {
  InvalidDescription,
  InvalidName
} from '../exceptions/InvalidTextError';
import { sanitizeString } from '../utils/string-sanitizer';

export class ProductSlot {
  private productPrice = 0;
  private productQuantity = 0;
  private productName = '';
  private productDescription = '';
  static MAX_QUANTITY = 10; // Max 10 items per slot to enforce physical upper limit
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
    if (quantity > ProductSlot.MAX_QUANTITY) {
      this.productQuantity = Number(ProductSlot.MAX_QUANTITY.toFixed());
    } else {
      this.productQuantity = Number(quantity.toFixed()); // expect only integers
    }
  }

  get price(): number {
    return this.productPrice;
  }

  // Still unsure about setting a max price
  set price(price: number) {
    if (price < 0) throw new InvalidPriceError();
    this.productPrice = Number(price.toFixed(2)); // round up to 2 decimal places
  }

  get name(): string {
    return this.productName;
  }

  set name(name: string) {
    if (name.length < 1) throw new InvalidName('Name');
    this.productName = sanitizeString(name);
  }

  get description(): string {
    return this.productDescription;
  }

  set description(desc: string) {
    if (desc.length < 5) throw new InvalidDescription('Description');
    this.productDescription = desc;
  }
}
