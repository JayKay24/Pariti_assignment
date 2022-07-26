import express from 'express';
import { body, param } from 'express-validator';

import {
  getProductSlots,
  getProductSlot,
  addProductSlot,
  updateProductSlot,
  buyProduct,
  deleteProductSlot
} from '../controllers/productSlot';
import { auth } from '../middleware/auth';

export class ProductSlotRoute {
  public routes(baseUrl = '', app: express.Application): void {
    app.route(`${baseUrl}`).get(getProductSlots);
    app.route(`${baseUrl}/product-slots`).get(getProductSlots);
    app.route(`${baseUrl}/product-slots/:name`).get(getProductSlot);
    app
      .route(`${baseUrl}/admin/product-slots`)
      .post(
        auth,
        body('name').exists().isAlpha('en-US', { ignore: /\s/i }),
        body('description').exists().isAlpha('en-US', { ignore: /\s/i }),
        body('quantity').exists().isInt().withMessage('must be an integer'),
        body('price').exists().isNumeric().withMessage('must be a number'),
        addProductSlot
      );
    app
      .route(`${baseUrl}/admin/product-slots/`)
      .put(
        auth,
        body('name').exists().isAlpha('en-US', { ignore: /\s/i }),
        body('description').exists().isAlpha('en-US', { ignore: /\s/i }),
        body('quantity').exists().isInt().withMessage('must be an integer'),
        body('price').exists().isNumeric().withMessage('must be a number'),
        updateProductSlot
      );
    app
      .route(`${baseUrl}/admin/product-slots/:name`)
      .delete(
        auth,
        param('name').exists().withMessage('Please specify a product slot'),
        deleteProductSlot
      );
    app
      .route(`${baseUrl}/product-slots/buy`)
      .post(
        body('name')
          .exists()
          .isAlpha('en-US', { ignore: /\s/i })
          .withMessage('Please specify an existing product.'),
        body('payload')
          .exists()
          .withMessage('Please provide your coin amount.'),
        buyProduct
      );
  }
}
