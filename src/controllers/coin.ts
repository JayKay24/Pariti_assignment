import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { VendingMachineInstance } from '../app';
import { ExpressValidatorError } from '../errorHandler';
import { CoinType } from '../models/enums/CoinType';
import { fetchCoffer } from '../utils/fetch-coffer';

const getCoins = (req: Request, res: Response) => {
  const response = fetchCoffer({});

  res.status(200).send(response);
};

const loadCoins = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ExpressValidatorError(400, errors.array());
  }

  VendingMachineInstance.emptyCoffer();

  for (const [key, value] of Object.entries(req.body)) {
    VendingMachineInstance.incrementCoins(<CoinType>key, <number>value);
  }

  const coffer = fetchCoffer({});
  res.status(200).send(coffer);
};

export { loadCoins, getCoins };
