import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { VendingMachineInstance } from '../app';
import { ExpressValidatorError, RequestError } from '../errorHandler';
import { Order } from '../models/classes/Order';
import { ProductSlot } from '../models/classes/ProductSlot';
import { CoinPayload } from '../models/contracts/CoinPayload';
import { CoinType } from '../models/enums/CoinType';
import { formatProductResponseObject } from '../utils/format-product-response';

const getProductSlots = (req: Request, res: Response) => {
  const productSlots = VendingMachineInstance.getProducts();
  const formattedSlots = productSlots.map(formatProductResponseObject);

  return res.status(200).send(formattedSlots);
};

const getProductSlot = (req: Request, res: Response) => {
  try {
    const product = VendingMachineInstance.getProduct(req.params.name);
    const response = formatProductResponseObject(product);
    return res.status(200).send(response);
  } catch (error) {
    throw new RequestError(400, <string>error);
  }
};

const updateProductSlot = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ExpressValidatorError(400, errors.array());
  }

  try {
    const product = VendingMachineInstance.getProduct(req.body.name);
    product.name = req.body.name;
    product.description = req.body.description;
    product.quantity = req.body.quantity;
    product.price = req.body.price;

    const response = formatProductResponseObject(product);
    return res.status(200).send(response);
  } catch (error) {
    throw new RequestError(400, <string>error);
  }
};

const addProductSlot = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ExpressValidatorError(400, errors.array());
  }

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
    const response = formatProductResponseObject(product);
    return res.status(201).send(response);
  } catch (error) {
    throw new RequestError(400, <string>error);
  }
};

const deleteProductSlot = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ExpressValidatorError(400, errors.array());
  }

  try {
    VendingMachineInstance.removeProduct(req.params.name);
    res.status(204).send({ message: 'Successfully deleted' });
  } catch (error) {
    throw new RequestError(400, <string>error);
  }
};

const buyProduct = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ExpressValidatorError(400, errors.array());
  }

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

export {
  addProductSlot,
  getProductSlots,
  getProductSlot,
  updateProductSlot,
  deleteProductSlot,
  buyProduct
};
