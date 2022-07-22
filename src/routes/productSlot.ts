import express from 'express';

import * as productSlotController from '../controllers/productSlot';

export class ProductSlotRoute {
  public routes(baseUrl = '', app: express.Application): void {
    app.route(`${baseUrl}/products`).get(productSlotController.getProducts);
    app
      .route(`${baseUrl}/products/:name`)
      .get(productSlotController.getProduct);
    app
      .route(`${baseUrl}/admin/products`)
      .post(productSlotController.addProduct);
    app
      .route(`${baseUrl}/admin/products/:name`)
      .patch(productSlotController.updateProductSlot);
    app.route(`${baseUrl}/products/buy`).post(productSlotController.buyProduct);
  }
}
