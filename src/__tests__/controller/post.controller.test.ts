import { post1 } from '../../mocks/modulePosts';
import * as postRepository from '../../app/repositories/postRepository';
import { getPostById } from '../../app/controllers/postController';
import * as validador from '../../app/middlewares/utils/validateUUID';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../app/repositories/postRepository');
jest.mock('../../database/db', () => ({
  query: jest.fn()
}));
jest.mock('express');
jest.mock('../../app/middlewares/utils/validateUUID');

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
    (postRepository.getPostById as jest.Mock).mockResolvedValue(post1);

    const req = mockRequest({
      id: '1f5dcd7c-f7aa-4a14-b26b-b65282682ce6'
    }) as Request;
    const res = mockResponse() as Response;

    validador.validarUUID(req, res, mockNext);
    await getPostById(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'Ok',
      details: post1
    });
  });

  it('should return error 404 because the post was not found', async () => {
    (postRepository.getPostById as jest.Mock).mockRejectedValue(null);

    const req = mockRequest({ id: '12' }) as Request;
    const res = mockResponse() as Response;

    await getPostById(req, res, mockNext);

    expect(postRepository.getPostById).toHaveBeenCalledWith('12');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      details: 'POST_NOT_FOUND'
    });
  });
});
