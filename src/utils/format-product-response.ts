import { ProductSlot } from '../models/classes/ProductSlot';

export function formatProductResponseObject(product: ProductSlot) {
  const response = {
    name: product.name,
    description: product.description,
    quantity: product.quantity,
    price: product.price
  };

  return response;
}
