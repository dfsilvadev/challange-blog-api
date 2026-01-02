import { Request } from 'express';

export interface TokenPayload {
  id: number;
  email: string;
  name: string;
  role_id?: string;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}
