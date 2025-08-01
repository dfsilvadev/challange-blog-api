import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { isUUID } from 'validator';

const validateUUID = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;

  if (!isUUID(id)) {
    res.status(400).json({ error: true, details: 'INVALID_UUID' });
    return;
  }

  next();
};

const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: true, details: errors.array() });
    return;
  }
  next();
};

export { validate, validateUUID };
