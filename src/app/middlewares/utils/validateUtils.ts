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

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  const extractedErrors: string[] = [];

  errors.array().forEach((err) => extractedErrors.push(err.msg));

  return res.status(422).json({
    error: true,
    details: extractedErrors
  });
};

export { validate, validateUUID };
