import { Request, Response } from 'express';

import * as postController from '../../app/controllers/postController';

import * as postRepository from '../../app/repositories/postRepository';

import { validateUUID } from '../../app/middlewares/utils/validateUtils';

import { mockPagination, mockPosts } from '../../utils/mocks/mockPost';

jest.mock('../../app/repositories/postRepository', () => ({
  findAll: jest.fn(),
  count: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  deleteById: jest.fn(),
  update: jest.fn()
}));

describe('postController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let next: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    req = { query: {}, params: {} };
    res = { status: statusMock };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('GET all posts and GET all posts by user ID', () => {
    it('should return paginated posts with default values', async () => {
      (postRepository.findAll as jest.Mock).mockResolvedValueOnce(mockPosts);
      (postRepository.count as jest.Mock).mockResolvedValueOnce(
        mockPosts.length
      );
      req.query = {};
      req.params = {};

      await postController.list(req as Request, res as Response);

      expect(postRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        orderBy: 'ASC',
        userId: undefined
      });
      expect(postRepository.count).toHaveBeenCalledWith({ userId: undefined });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'Ok',
        details: mockPosts,
        pagination: expect.objectContaining(mockPagination)
      });
    });

    it('should use custom page, limit and orderBy DESC', async () => {
      (postRepository.findAll as jest.Mock).mockResolvedValueOnce([]);
      (postRepository.count as jest.Mock).mockResolvedValueOnce(
        mockPosts.length
      );
      req.query = { page: '2', limit: '2', orderBy: 'DESC' };
      req.params = {};

      await postController.list(req as Request, res as Response);

      expect(postRepository.findAll).toHaveBeenCalledWith({
        page: 2,
        limit: 2,
        orderBy: 'DESC',
        userId: undefined
      });
      expect(postRepository.count).toHaveBeenCalledWith({ userId: undefined });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'Ok',
          details: [],
          pagination: expect.objectContaining({
            total: mockPosts.length,
            totalPages: 3,
            registersPerPage: 2,
            currentPage: 2,
            hasNextPage: true,
            hasPreviousPage: true,
            nextPage: 3,
            previousPage: 1,
            firstPage: 1,
            lastPage: 3
          })
        })
      );
    });

    it('should fallback to ASC if orderBy is invalid', async () => {
      (postRepository.findAll as jest.Mock).mockResolvedValueOnce(mockPosts);
      (postRepository.count as jest.Mock).mockResolvedValueOnce(
        mockPosts.length
      );
      req.query = { orderBy: 'INVALID' };
      req.params = {};

      await postController.list(req as Request, res as Response);

      expect(postRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        orderBy: 'ASC',
        userId: undefined
      });
      expect(postRepository.count).toHaveBeenCalledWith({ userId: undefined });
    });

    it('should handle userId from params', async () => {
      const userId = '4536040b-22c5-4c38-a881-5966bf5b6cc3';
      const mockPostByUserId = mockPosts.filter(
        (post) => post.user_id === userId
      );
      (postRepository.findAll as jest.Mock).mockResolvedValueOnce(
        mockPostByUserId
      );
      (postRepository.count as jest.Mock).mockResolvedValueOnce(
        mockPostByUserId.length
      );
      req.query = {};
      req.params = { userId };

      await postController.listByUserId(req as Request, res as Response);

      expect(postRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        orderBy: 'ASC',
        userId
      });
      expect(postRepository.count).toHaveBeenCalledWith({ userId });
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'Ok',
          details: mockPostByUserId,
          pagination: expect.objectContaining({
            total: mockPostByUserId.length,
            totalPages: 1,
            registersPerPage: 10,
            currentPage: 1,
            hasNextPage: false,
            hasPreviousPage: false,
            nextPage: 0,
            previousPage: 0,
            firstPage: 0,
            lastPage: 0
          })
        })
      );
    });

    it('should handle pagination with only one page', async () => {
      (postRepository.findAll as jest.Mock).mockResolvedValueOnce(mockPosts);
      (postRepository.count as jest.Mock).mockResolvedValueOnce(
        mockPosts.length
      );
      req.query = { page: '1', limit: '10' };
      req.params = {};

      await postController.list(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          pagination: expect.objectContaining({
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
            nextPage: 0,
            previousPage: 0,
            firstPage: 0,
            lastPage: 0
          })
        })
      );
    });
  });

  describe('GET /posts/:id', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return the post successfully with a valid UUID', async () => {
      const id = '1f5dcd7c-f7aa-4a14-b26b-b65282682ce6';
      const mockPostById = mockPosts.filter((post) => post.id === id);
      (postRepository.findById as jest.Mock).mockResolvedValueOnce(
        mockPostById
      );
      req.params = { id };

      validateUUID(req as Request, res as Response, next);
      await postController.getById(req as Request, res as Response, next);

      expect(postRepository.findById).toHaveBeenCalledWith(id);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'Ok',
          details: mockPostById
        })
      );
    });

    it('deve retornar 404 se o post não for encontrado', async () => {
      (postRepository.findById as jest.Mock).mockResolvedValue(null);
      req.params = { id: '1f5dcd7c-f7aa-4a14-b26b-b65282682ce6' };

      await postController.getById(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ details: 'NOT_FOUND_POST', error: true })
      );
    });

    it('deve retornar 500 se ocorrer um erro inesperado', async () => {
      const errorMessage = 'Unexpected error';
      (postRepository.findById as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );
      req.params = { id: '1f5dcd7c-f7aa-4a14-b26b-b65282682ce6' };

      await postController.getById(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ details: errorMessage, error: true })
      );
    });

    it('deve garantir que só retorna post se is_active = true', async () => {
      (postRepository.findById as jest.Mock).mockResolvedValue(null);
      req.params = { id: 'inativo-id' };

      await postController.getById(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ details: 'NOT_FOUND_POST', error: true })
      );
    });
  });
});
