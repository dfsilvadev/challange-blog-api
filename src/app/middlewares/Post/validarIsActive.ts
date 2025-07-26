import { Request, Response, NextFunction } from 'express';

export const validaIsActive = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { is_active } = req.body;

  if (typeof is_active !== 'boolean') {
    res.status(400).json({ error: true, details: 'INVALID_IS_ACTIVE' });
    return;
  }

  next();
};
