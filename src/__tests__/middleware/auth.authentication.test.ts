import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  authenticateToken,
  authorizeRoles
} from '../../app/middlewares/auth/authenticationValidate';

import * as roleRepository from '../../app/repositories/roleRepository';

jest.mock('jsonwebtoken');
jest.mock('../../app/repositories/roleRepository');

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
      error: true,
      details: 'INVALID_TOKEN'
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

describe('authorizeRoles middleware', () => {
  let req: Partial<Request & { user?: any }>;
  let res: Response;
  let next: jest.Mock;
  const mockFindUserByRoleId = roleRepository.findUserByRoleId as jest.Mock;

  beforeEach(() => {
    req = { headers: {} };
    res = mockResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 403 if roleId or userId is missing', async () => {
    req.user = {};
    const middleware = authorizeRoles(['teacher']);
    await middleware(req as any, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      details: 'NOT_PERMISSION'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if role not found for user', async () => {
    req.user = { roleId: 'role-1', id: 'user-1' };
    mockFindUserByRoleId.mockResolvedValue(null);

    const middleware = authorizeRoles(['teacher']);
    await middleware(req as any, res, next);

    expect(mockFindUserByRoleId).toHaveBeenCalledWith('role-1', 'user-1');
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      details: 'NOT_PERMISSION'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if role is not allowed', async () => {
    req.user = { roleId: 'role-1', id: 'user-1' };
    mockFindUserByRoleId.mockResolvedValue({ id: 'role-1', name: 'student' });

    const middleware = authorizeRoles(['teacher']);
    await middleware(req as any, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      details: 'NOT_PERMISSION'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if role is allowed', async () => {
    req.user = { roleId: 'role-1', id: 'user-1' };
    mockFindUserByRoleId.mockResolvedValue({ id: 'role-1', name: 'teacher' });

    const middleware = authorizeRoles(['teacher']);
    await middleware(req as any, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 500 if repository throws', async () => {
    req.user = { roleId: 'role-1', id: 'user-1' };
    mockFindUserByRoleId.mockRejectedValue(new Error('DB error'));

    const middleware = authorizeRoles(['teacher']);
    await middleware(req as any, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      details: 'ERROR_PERMISSION'
    });
    expect(next).not.toHaveBeenCalled();
  });
});
