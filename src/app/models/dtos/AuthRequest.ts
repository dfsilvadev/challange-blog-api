import { Request } from 'express';

export interface TokenPayload {
  id: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}
