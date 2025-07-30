import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../../app/middlewares/auth/authenticationValidate';

// Mock do config.jwtSecret
jest.mock('../../utils/config/config', () => ({
  default: {
    jwtSecret: 'mock-secret'
  }
}));

// Mock do jwt
jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  verify: jest.fn()
}));

describe('Middleware - authenticateToken', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 401 if the token is not provided', async () => {
    req.headers = {};

    await authenticateToken(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Token de autenticação não fornecido.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if the token is invalid', async () => {
    req.headers = {
      authorization: 'Bearer token-invalido'
    };

    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(new Error('Token inválido'), null); // simula erro
    });

    await authenticateToken(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Token de autenticação inválido ou expirado.'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should assign req.user and call next if the token is valid', async () => {
    req.headers = {
      authorization: 'Bearer token-valido'
    };

    const fakePayload = { id: 'user123', role: 'admin' };
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, fakePayload); // simula token válido
    });

    await authenticateToken(req as Request, res as Response, next);

    expect(req).toHaveProperty('user', fakePayload);
    expect(next).toHaveBeenCalled();
  });
});
