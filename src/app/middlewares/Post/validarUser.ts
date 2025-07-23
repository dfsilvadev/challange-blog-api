import { Request, Response, NextFunction } from 'express';
import { isUUID } from 'validator';
import * as userRepository from '../../repositories/userRepository';

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

  const exists = await userRepository.existsById(user_id);

  if (!exists) {
    res.status(404).json({ error: true, details: 'USER_NOT_FOUND' });
    return;
  }

  next();
};
