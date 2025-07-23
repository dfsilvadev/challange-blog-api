import { Request, Response, NextFunction } from 'express';

export const validaContent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { content } = req.body;

  if (!content || typeof content !== 'string') {
    res.status(400).json({ error: true, details: 'INVALID_CONTENT' });
    return;
  }

  next();
};
