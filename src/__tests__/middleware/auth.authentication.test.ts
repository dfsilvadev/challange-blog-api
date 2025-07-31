import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../../app/middlewares/auth/authenticationValidate';

jest.mock('jsonwebtoken');

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res as Response;
};

describe('authenticateToken middleware', () => {
  let req: Partial<Request & { user?: any }>;
  let res: Response;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} };
    res = mockResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 401 if token is missing', async () => {
    req.headers = {};
    await authenticateToken(req as any, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Token de autenticação não fornecido.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if token is invalid or expired', async () => {
    req.headers = { authorization: 'Bearer invalidtoken' };
    (jwt.verify as jest.Mock).mockImplementation((_token, _secret, cb) =>
      cb(new Error('invalid token'))
    );
    await authenticateToken(req as any, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Token de autenticação inválido ou expirado.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next and set req.user if token is valid', async () => {
    req.headers = { authorization: 'Bearer validtoken' };
    const payload = { id: 'user-1', name: 'User' };
    (jwt.verify as jest.Mock).mockImplementation((_token, _secret, cb) =>
      cb(null, payload)
    );
    await authenticateToken(req as any, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(payload);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
