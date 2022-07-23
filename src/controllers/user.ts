import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import authentication from '../config/authentication.json';

const login = (req: Request, res: Response, next: NextFunction) => {
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
