import { NextFunction, Request, Response } from 'express';
import { VendingMachineInstance } from '../app';
import { CoinType } from '../models/enums/CoinType';
import { fetchCoffer } from '../utils/fetch-coffer';

const getCoins = (req: Request, res: Response, next: NextFunction) => {
  const response = fetchCoffer({});

  res.status(200).send(response);
};

const loadCoins = (req: Request, res: Response, next: NextFunction) => {
  for (const [key, value] of Object.entries(req.body)) {
    VendingMachineInstance.loadCoins(<CoinType>key, <number>value);
  }

  const coffer = fetchCoffer({});
  res.status(200).send(coffer);
};

export { loadCoins, getCoins };
