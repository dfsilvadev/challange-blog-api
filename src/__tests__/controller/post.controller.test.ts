jest.mock('../../app/repositories/postRepository');
jest.mock('../../database/db', () => ({
  query: jest.fn()
}));
jest.mock('express');

import { post1 } from '../../mocks/modulePosts';
import * as postRepository from '../../app/repositories/postRepository';
import { getPostById } from '../../app/controllers/postController';
import { Request, Response, NextFunction } from 'express';

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

  it('deve retornar o post com sucesso', async () => {
    (postRepository.getPostById as jest.Mock).mockResolvedValue(post1);
    const req = mockRequest({
      id: '1f5dcd7c-f7aa-4a14-b26b-b65282682ce6'
    }) as Request;
    const res = mockResponse() as Response;

    await getPostById(req, res, mockNext);

    expect(postRepository.getPostById).toHaveBeenCalledWith(
      '1f5dcd7c-f7aa-4a14-b26b-b65282682ce6'
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'Ok',
      details: post1
    });
  });

  it('deve retornar 404 pois o post não foi encontrado', async () => {
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
