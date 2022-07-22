import { NextFunction, Request, Response } from 'express';
import { VendingMachineInstance } from '../app';
import { ProductSlot } from '../models/classes/ProductSlot';

const getProducts = (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = VendingMachineInstance.getProducts();
    return res.status(200).send(products);
  } catch (error) {
    next(error);
  }
};

const getProduct = (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = VendingMachineInstance.getProduct(req.params.productName);
    return res.status(200).send(product);
  } catch (error) {
    next(error);
  }
};

const addProduct = (req: Request, res: Response, next: NextFunction) => {
  try {
    VendingMachineInstance.addProduct(
      new ProductSlot(
        req.body.name,
        req.body.description,
        req.body.quantity,
        req.body.price
      )
    );

    const product = VendingMachineInstance.getProduct(req.body.name);
    return res.status(201).send(product);
  } catch (error) {
    next(error);
  }
};

export { addProduct, getProducts, getProduct };
