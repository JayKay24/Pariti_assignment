import { NextFunction, Request, Response } from 'express';
import { VendingMachineInstance } from '../app';
import { Order } from '../models/classes/Order';
import { ProductSlot } from '../models/classes/ProductSlot';
import { CoinPayload } from '../models/contracts/CoinPayload';
import { CoinType } from '../models/enums/CoinType';
import { formatProductResponseObject } from '../utils/format-product-response';

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
    const product = VendingMachineInstance.getProduct(req.params.name);
    const response = formatProductResponseObject(product);
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

const updateProductSlot = (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = VendingMachineInstance.getProduct(req.params.name);
    if (req.body.name) {
      product.name = req.body.name;
    }

    if (req.body.description) {
      product.description = req.body.description;
    }

    if (req.body.quantity) {
      product.quantity = req.body.quantity;
    }

    if (req.body.price) {
      product.price = req.body.price;
    }

    const response = formatProductResponseObject(product);
    return res.status(200).send(response);
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

const buyProduct = (req: Request, res: Response, next: NextFunction) => {
  const payload = <CoinPayload>{};
  try {
    for (const [key, value] of Object.entries(req.body.payload)) {
      payload[<CoinType>key] = <number>value;
    }

    const product = VendingMachineInstance.getProduct(req.body.name);
    const change = VendingMachineInstance.buyProduct(payload, req.body.name);
    const order = new Order(
      product.name,
      product.description,
      product.price,
      change
    );
    return res.status(200).send(order);
  } catch (error) {
    next(error);
  }
};

export { addProduct, getProducts, getProduct, updateProductSlot, buyProduct };
