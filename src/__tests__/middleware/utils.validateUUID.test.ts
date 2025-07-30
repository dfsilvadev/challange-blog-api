import { NextFunction, Request, Response } from 'express';

import { validateUUID } from '../../app/middlewares/utils/validateUtils';

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

  it('should return a valid UUID', () => {
    req.params = { id: '123e4567-e89b-12d3-a456-426614174000' };

    validateUUID(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 400 if the UUID is invalid', () => {
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
