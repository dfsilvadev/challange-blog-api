import { Request, Response, NextFunction } from 'express';
import { isUUID } from 'validator';

export const validarUUID = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.body;

  if (!isUUID(id)) {
    res.status(400).json({ error: true, details: 'INVALID_UUID' });
    return;
  }

  next();
};
