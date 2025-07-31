import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import {
  validate,
  validateUUID
} from '../../app/middlewares/utils/validateUtils';

jest.mock('express-validator', () => ({
  validationResult: jest.fn()
}));

describe('validateUUID middleware (com mocks)', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('deve retornar UUID válido', () => {
    req.params = { id: '123e4567-e89b-12d3-a456-426614174000' };

    validateUUID(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('deve retornar 400 se o UUID for inválido', () => {
    req.params = { id: 'invalido' };

    validateUUID(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      details: 'INVALID_UUID'
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe('validate middleware', () => {
  const mockReq = {} as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  } as unknown as Response;
  const mockNext = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar next() se não houver erros de validação', () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true
    });

    validate(mockReq, mockRes, mockNext);

    expect(validationResult).toHaveBeenCalledWith(mockReq);
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  it('deve retornar 400 e json com erros se houver erros de validação', () => {
    const fakeErrors = [{ msg: 'Campo obrigatório', param: 'name' }];
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => fakeErrors
    });

    validate(mockReq, mockRes, mockNext);

    expect(validationResult).toHaveBeenCalledWith(mockReq);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: true,
      details: fakeErrors
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
