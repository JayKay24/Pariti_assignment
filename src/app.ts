import * as bodyParser from 'body-parser';
import express from 'express';

import { Index } from './routes/index';

class App {
  app: express.Application;
  indexRoutes: Index = new Index();

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.indexRoutes.routes(this.app);
  }
}

export default new App().app;
