import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmailOrName } from '../repositories/userRepository';
import config from '../../utils/config/config';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByEmailOrName(username);
    if (!user) {
      res.status(401).json({ error: true, details: 'INVALID_USER' });
    }

    const validPassword = await bcrypt.compare(
      password,
      user?.password_hash || ''
    );
    if (!validPassword) {
      res.status(401).json({ error: true, details: 'ENCRYPTION_ERROR' });
    }

    const payload = { id: user?.id, email: user?.email, name: user?.name };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });

    res.status(200).json({ status: 'OK', details: { token: token } });
  } catch {
    res.status(500).json({ error: true, details: 'SERVER_ERROR_INTERNAL' });
  }
};
