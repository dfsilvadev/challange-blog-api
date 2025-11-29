import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import * as roleRepository from '../../repositories/roleRepository';

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
    return res.status(403).json({ error: true, details: 'INVALID_TOKEN' });
  }
};

export const authorizeRoles = (allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const roleId = req.user?.roleId as string | undefined;
    const userId = req.user?.id as string | undefined;

    if (!roleId || !userId) {
      return res.status(403).json({ error: true, details: 'NOT_PERMISSION' });
    }

    try {
      const role = await roleRepository.findUserByRoleId(roleId, userId);
      const roleName = role?.name;

      if (!roleName || !allowedRoles.includes(roleName)) {
        return res.status(403).json({ error: true, details: 'NOT_PERMISSION' });
      }

      next();
    } catch {
      return res.status(500).json({ error: true, details: 'ERROR_PERMISSION' });
    }
  };
};
