import express from 'express';
import { body } from 'express-validator';

import * as productSlotController from '../controllers/productSlot';
import { auth } from '../middleware/auth';

export class ProductSlotRoute {
  public routes(baseUrl = '', app: express.Application): void {
    app.route(`${baseUrl}/products`).get(productSlotController.getProducts);
    app
      .route(`${baseUrl}/products/:name`)
      .get(productSlotController.getProduct);
    app
      .route(`${baseUrl}/admin/products`)
      .post(
        auth,
        body('name').not().isEmpty().isAlpha('en-US', { ignore: /\s/i }),
        body('description').not().isEmpty().isAlpha('en-US', { ignore: /\s/i }),
        body('quantity')
          .not()
          .isEmpty()
          .isInt()
          .withMessage('must be an integer'),
        body('price')
          .not()
          .isEmpty()
          .isNumeric()
          .withMessage('must be a number'),
        productSlotController.addProduct
      );
    app
      .route(`${baseUrl}/admin/products/`)
      .patch(
        auth,
        body('name').not().isEmpty().isAlpha('en-US', { ignore: /\s/i }),
        body('description').not().isEmpty().isAlpha('en-US', { ignore: /\s/i }),
        body('quantity')
          .not()
          .isEmpty()
          .isInt()
          .withMessage('must be an integer'),
        body('price')
          .not()
          .isEmpty()
          .isNumeric()
          .withMessage('must be a number'),
        productSlotController.updateProductSlot
      );
    app.route(`${baseUrl}/products/buy`).post(productSlotController.buyProduct);
  }
}
