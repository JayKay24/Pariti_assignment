import express from 'express';
import { body } from 'express-validator';

import {
  getProductSlots,
  getProductSlot,
  addProductSlot,
  updateProductSlot,
  buyProduct
} from '../controllers/productSlot';
import { auth } from '../middleware/auth';

export class ProductSlotRoute {
  public routes(baseUrl = '', app: express.Application): void {
    app.route(`${baseUrl}/products-slot`).get(getProductSlots);
    app.route(`${baseUrl}/products-slot/:name`).get(getProductSlot);
    app
      .route(`${baseUrl}/admin/products-slot`)
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
        addProductSlot
      );
    app
      .route(`${baseUrl}/admin/products-slot/`)
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
        updateProductSlot
      );
    app.route(`${baseUrl}/products-slot/buy`).post(buyProduct);
  }
}
