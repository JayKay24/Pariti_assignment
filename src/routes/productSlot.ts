import express from 'express';

import * as productSlotController from '../controllers/productSlot';

export class ProductSlotRoute {
  public routes(app: express.Application): void {
    app.route('/api/v1/products').get(productSlotController.getProducts);
    app
      .route('/api/v1/products/:productName')
      .get(productSlotController.getProduct);
    app.route('/api/v1/products').post(productSlotController.addProduct);
  }
}
