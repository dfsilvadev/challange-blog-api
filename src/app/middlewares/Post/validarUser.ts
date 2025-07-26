import { Request, Response, NextFunction } from 'express';
import { isUUID } from 'validator';
import { findUserById } from '../../repositories/userRepository';

export const validarUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.body;

  if (!isUUID(user_id)) {
    res.status(400).json({ error: true, details: 'INVALID_UUID' });
    return;
  }

  const user = await findUserById(user_id);

  if (!user) {
    res.status(404).json({ error: true, details: 'USER_NOT_FOUND' });
    return;
  }

  next();
};
