jest.mock('../../app/repositories/postRepository');
jest.mock('../../database/db', () => ({
  query: jest.fn()
}));
jest.mock('validator', () => ({
  isUUID: jest.fn(() => true)
}));

import { Request, Response, NextFunction } from 'express';
import { validarUUID } from '../../app/middlewares/validarUUID';
import validator from 'validator';

const mockRequest = (params = {}): Partial<Request> => ({ params });

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext: NextFunction = jest.fn();

describe('validarUUID', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return undefined because the success does not return anything', async () => {
    (validator.isUUID as jest.Mock).mockReturnValue(true);
    const req1 = mockRequest({
      id: '1f5dcd7c-f7aa-4a14-b26b-b65282682ce6'
    }) as Request;
    const res2 = mockResponse() as Response;
    validarUUID(req1, res2, mockNext);
    expect(validator.isUUID).toHaveBeenCalledWith(
      '1f5dcd7c-f7aa-4a14-b26b-b65282682ce6'
    );
    expect(res2.json).not.toHaveBeenCalled();
    expect(res2.status).not.toHaveBeenCalled();
  });

  it('should return error because the id is invalid', async () => {
    (validator.isUUID as jest.Mock).mockReturnValue(false);
    const req = mockRequest({ id: '12' }) as Request;
    const res = mockResponse() as Response;

    validarUUID(req, res, mockNext);

    expect(validator.isUUID).toHaveBeenCalledWith('12');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      details: 'INVALID_UUID'
    });
  });
});
