import { Request, Response, NextFunction } from 'express';
import { isUUID } from 'validator';
import { query } from '../../../database/db';

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

  const result = await query<{ exists: boolean }>(
    `
      SELECT EXISTS (
        SELECT 1 FROM tb_category WHERE id = $1
      ) AS "exists"
      `,
    [category_id]
  );

  const exists = !!result[0]?.exists;

  if (!exists) {
    res.status(404).json({ error: true, details: 'CATEGORY_NOT_FOUND' });
    return;
  }

  next();
};
