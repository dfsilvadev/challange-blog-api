import { Request } from 'express';

export interface TokenPayload {
  id: number;
  email: string;
  name: string;
  roleId?: string;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}
