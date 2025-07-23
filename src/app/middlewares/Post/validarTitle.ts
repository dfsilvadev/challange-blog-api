import { Request, Response, NextFunction } from 'express';

export const validaTitle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string') {
    res.status(400).json({ error: true, details: 'INVALID_TITLE' });
    return;
  }

  next();
};
