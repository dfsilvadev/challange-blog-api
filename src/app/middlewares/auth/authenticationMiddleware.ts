import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import { AuthRequest, TokenPayload } from '../../models/dtos/AuthRequest';
import config from '../../../utils/config/config';

const verifyAsync = promisify(jwt.verify) as (
  _token: string,
  _secretOrPublicKey: jwt.Secret,
  _options?: jwt.VerifyOptions
) => Promise<object | string>;

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Token de autenticação não fornecido.' });
  }

  try {
    const decoded = (await verifyAsync(
      token,
      config.jwtSecret
    )) as TokenPayload;
    req.user = decoded;
    next();
  } catch {
    return res
      .status(403)
      .json({ message: 'Token de autenticação inválido ou expirado.' });
  }
};
