import { Request, Response } from 'express';
import { VendingMachineInstance } from '../app';
import { RequestError } from '../errorHandler';
import { Order } from '../models/classes/Order';
import { ProductSlot } from '../models/classes/ProductSlot';
import { CoinPayload } from '../models/contracts/CoinPayload';
import { CoinType } from '../models/enums/CoinType';
import { formatProductResponseObject } from '../utils/format-product-response';

const getProducts = (req: Request, res: Response) => {
  const products = VendingMachineInstance.getProducts();
  return res.status(200).send(products);
};

const getProduct = (req: Request, res: Response) => {
  try {
    const product = VendingMachineInstance.getProduct(req.params.name);
    const response = formatProductResponseObject(product);
    return res.status(200).send(response);
  } catch (error) {
    throw new RequestError(400, <string>error);
  }
};

const updateProductSlot = (req: Request, res: Response) => {
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
    throw new RequestError(400, <string>error);
  }
};

const addProduct = (req: Request, res: Response) => {
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
    throw new RequestError(400, <string>error);
  }
};

const buyProduct = (req: Request, res: Response) => {
  const payload = <CoinPayload>{};
  for (const [key, value] of Object.entries(req.body.payload)) {
    payload[<CoinType>key] = <number>value;
  }

  try {
    const product = VendingMachineInstance.getProduct(req.body.name);
    const change = VendingMachineInstance.buyProduct(payload, product.name);

    const order = new Order(
      product.name,
      product.description,
      product.price,
      change
    );

    return res.status(200).send(order);
  } catch (error) {
    throw new RequestError(400, <string>error);
  }
};

export { addProduct, getProducts, getProduct, updateProductSlot, buyProduct };
