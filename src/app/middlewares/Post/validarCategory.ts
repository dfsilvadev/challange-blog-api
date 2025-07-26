import { Request, Response, NextFunction } from 'express';
import { isUUID } from 'validator';
import { findCategoryById } from '../../repositories/postRepository';

export const validarCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { category_id } = req.body;

  if (!isUUID(category_id)) {
    res.status(400).json({ error: true, details: 'INVALID_UUID' });
    return;
  }

  const exists = await findCategoryById(category_id);

  if (!exists) {
    res.status(404).json({ error: true, details: 'CATEGORY_NOT_FOUND' });
    return;
  }

  next();
};
