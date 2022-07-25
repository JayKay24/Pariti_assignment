import * as bodyParser from 'body-parser';
import express from 'express';
import { errorHandler } from './errorHandler';

import { VendingMachine } from './models/classes/VendingMachine';
import { CoinRoute } from './routes/coin';
import { ProductSlotRoute } from './routes/productSlot';
import { UserRoute } from './routes/user';

class App {
  app: express.Application;
  productRoutes: ProductSlotRoute = new ProductSlotRoute();
  coinRoutes: CoinRoute = new CoinRoute();
  userRoutes: UserRoute = new UserRoute();
  vendingMachine: VendingMachine;
  baseUrl = '/api/v1';

  constructor(vendingMachine: VendingMachine) {
    this.app = express();
    this.vendingMachine = vendingMachine;
    this.app.use(bodyParser.json());
    this.userRoutes.routes(this.baseUrl, this.app);
    this.productRoutes.routes(this.baseUrl, this.app);
    this.coinRoutes.routes(this.baseUrl, this.app);
    this.app.use(errorHandler);
  }
}

const VendingMachineInstance = VendingMachine.getInstance();

const app = new App(VendingMachineInstance).app;

export { app, VendingMachineInstance };
