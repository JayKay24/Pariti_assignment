export class Product {
  constructor(
    public name: string,
    public description: string,
    public quantity: number,
    public price: number
  ) {
    this.quantity = Number(quantity.toFixed()); // expect only integers
    this.price = Number(price.toFixed(2)); // round up to 2 decimal places
  }
}
