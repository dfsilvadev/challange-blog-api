import { validarUUID } from '../../app/middlewares/utils/validateUtils';
import { Request, Response, NextFunction } from 'express';

describe('validarUUID middleware (com mocks)', () => {
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

    validarUUID(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('deve retornar 400 se o UUID for inválido', () => {
    req.params = { id: 'invalido' };

    validarUUID(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      details: 'INVALID_UUID'
    });
    expect(next).not.toHaveBeenCalled();
  });
});
