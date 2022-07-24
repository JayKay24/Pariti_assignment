import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as jwt from 'jsonwebtoken';

import authentication from '../config/authentication.json';
import { ExpressValidatorError } from '../errorHandler';

const login = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ExpressValidatorError(400, errors.array());
  }

  const username = req.body.username;
  const password = req.body.password;

  const validate =
    username === authentication.username &&
    password === authentication.password;

  if (validate) {
    const body = { id: authentication.username };
    const token = jwt.sign({ user: body }, authentication.secret);

    return res.json({ token });
  } else {
    return res
      .status(401)
      .send({ error: 'Please enter correct username & password' });
  }
};

export { login };
