import { NextFunction, Request, Response } from 'express';

import { getById } from '../../app/controllers/postController';

import { findById } from '../../app/repositories/postRepository';

import { validateUUID } from '../../app/middlewares/utils/validateUtils';

import { mockPost } from '../../utils/mocks/mockPost';

jest.mock('express');
jest.mock('../../app/repositories/postRepository');
jest.mock('../../database/db', () => ({
  query: jest.fn()
}));
jest.mock('../../app/middlewares/utils/validateUtils');

const mockRequest = (params = {}): Partial<Request> => ({ params });

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext: NextFunction = jest.fn();

describe('GET /posts/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the post successfully with a valid UUID', async () => {
    (findById as jest.Mock).mockResolvedValue(mockPost);

    const req = mockRequest({
      id: '1f5dcd7c-f7aa-4a14-b26b-b65282682ce6'
    }) as Request;
    const res = mockResponse() as Response;

    validateUUID(req, res, mockNext);
    await getById(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'Ok',
      details: mockPost
    });
  });

  it('should return error 404 because the post was not found', async () => {
    (findById as jest.Mock).mockRejectedValue(null);

    const req = mockRequest({ id: '12' }) as Request;
    const res = mockResponse() as Response;

    await getById(req, res, mockNext);

    expect(findById).toHaveBeenCalledWith('12');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      details: 'NOT_FOUND_POST'
    });
  });
});
