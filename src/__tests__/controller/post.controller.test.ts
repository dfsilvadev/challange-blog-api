import { Request, Response } from 'express';

import * as postController from '../../app/controllers/postController';

import * as categoryRepository from '../../app/repositories/categoryRepository';
import * as postRepository from '../../app/repositories/postRepository';
import * as userRepository from '../../app/repositories/userRepository';

import { validateUUID } from '../../app/middlewares/utils/validateUtils';

import { mockPagination, mockPosts } from '../../utils/mocks/mockPost';
import { mockUser } from '../../utils/mocks/mockUser';

jest.mock('../../app/repositories/postRepository', () => ({
  findAll: jest.fn(),
  count: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  deleteOne: jest.fn(),
  update: jest.fn()
}));

jest.mock('../../app/repositories/userRepository', () => ({
  findById: jest.fn()
}));

jest.mock('../../app/repositories/categoryRepository', () => ({
  findById: jest.fn()
}));

describe('PostController', () => {
  interface MockRequest extends Partial<Request> {
    user?: { id: string };
  }
  let req: MockRequest;
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

    it('should return paginated posts with custom page, limit and orderBy DESC', async () => {
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

    it('should fallback to ASC order if orderBy is invalid', async () => {
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

    it('should return posts filtered by userId', async () => {
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

    it('should return correct pagination when only one page', async () => {
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

    it('should return post by id when found', async () => {
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

    it('should return 404 when post is not found', async () => {
      (postRepository.findById as jest.Mock).mockResolvedValue(null);
      req.params = { id: '1f5dcd7c-f7aa-4a14-b26b-b65282682ce6' };

      await postController.getById(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ details: 'NOT_FOUND_POST', error: true })
      );
    });

    it('should return 500 when an unexpected error occurs', async () => {
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

    it('should return 404 when post is inactive', async () => {
      (postRepository.findById as jest.Mock).mockResolvedValue(null);
      req.params = { id: 'inativo-id' };

      await postController.getById(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ details: 'NOT_FOUND_POST', error: true })
      );
    });
  });

  describe('DELETE /post/:id', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should delete a post successfully if user is authenticated and is the creator', async () => {
      const id = 'post-id-123';
      const loggedUserId = 'user-1';
      (postRepository.findById as jest.Mock).mockResolvedValueOnce({
        id,
        user_id: loggedUserId
      });
      (postRepository.deleteOne as jest.Mock).mockResolvedValueOnce({});
      req.params = { id };
      req.user = { id: loggedUserId };

      await postController.removeById(req as Request, res as Response, next);

      expect(postRepository.findById).toHaveBeenCalledWith(id);
      expect(postRepository.deleteOne).toHaveBeenCalledWith(id);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'OK',
        details: 'POST_DELETED'
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      const id = 'post-id-123';
      (postRepository.findById as jest.Mock).mockResolvedValueOnce({
        id,
        user_id: 'user-1'
      });
      req.params = { id };
      req.user = undefined;

      await postController.removeById(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'UNAUTHORIZED'
      });
    });

    it('should return 403 if user is not the creator', async () => {
      const id = 'post-id-123';
      (postRepository.findById as jest.Mock).mockResolvedValueOnce({
        id,
        user_id: 'user-1'
      });
      req.params = { id };
      req.user = { id: 'other-user' };

      await postController.removeById(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'FORBIDDEN: Only the post creator can delete this post'
      });
    });

    it('should return 404 if post does not exist', async () => {
      const id = 'not-found-id';
      (postRepository.findById as jest.Mock).mockResolvedValueOnce(null);
      req.params = { id };
      req.user = { id: 'user-1' };

      await postController.removeById(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'NOT_FOUND_POST'
      });
    });
  });

  describe('create', () => {
    let next: jest.Mock;
    beforeEach(() => {
      jest.clearAllMocks();
      next = jest.fn();
    });

    it('should return 404 if user does not exist', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValueOnce(null);
      req.body = { user_id: 'user-id', category_id: 'cat-id' };
      await postController.create(req as any, res as any, next);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'NOT_FOUND_USER'
      });
    });

    it('should return 404 if category does not exist', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValueOnce(mockUser);
      (categoryRepository.findById as jest.Mock).mockResolvedValueOnce(null);

      req.body = { user_id: 'user-id', category_id: 'cat-id' };
      await postController.create(req as any, res as any, next);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'NOT_FOUND_CATEGORY'
      });
    });

    it('should return 500 on unexpected error', async () => {
      (userRepository.findById as jest.Mock).mockRejectedValueOnce(
        new Error('DB error')
      );
      req.body = { user_id: 'user-id', category_id: 'cat-id' };
      await postController.create(req as any, res as any, next);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'DB error'
      });
    });
  });

  describe('updateById', () => {
    it('should return 404 if post does not exist', async () => {
      (postRepository.findById as jest.Mock).mockResolvedValueOnce(null);
      req.params = { id: 'post-id' };
      req.body = {}; // Garante que body existe
      await postController.updateById(req as any, res as any, next);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'NOT_FOUND_POST'
      });
    });

    it('should return 404 if category does not exist', async () => {
      (postRepository.findById as jest.Mock).mockResolvedValueOnce({
        id: 'post-id'
      }); // Retorna post válido
      (categoryRepository.findById as jest.Mock).mockResolvedValueOnce(null);
      req.params = { id: 'post-id' };
      req.body = { category_id: 'cat-id' };
      await postController.updateById(req as any, res as any, next);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'NOT_FOUND_CATEGORY'
      });
    });

    it('should return 500 on unexpected error', async () => {
      (postRepository.findById as jest.Mock).mockRejectedValueOnce(
        new Error('DB error')
      );
      req.params = { id: 'post-id' };
      req.body = {}; // Garante que body existe
      await postController.updateById(req as any, res as any, next);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'DB error'
      });
    });
  });

  describe('removeById', () => {
    it('should return 500 on unexpected error', async () => {
      (postRepository.findById as jest.Mock).mockRejectedValueOnce(
        new Error('DB error')
      );
      req.params = { id: '1f5dcd7c-f7aa-4a14-b26b-b65282682ce6' };
      req.user = { id: '1f5dcd7c-f7aa-4a14-b26b-b65282682df7' };
      await postController.removeById(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'DB error'
      });
    });
  });

  describe('list', () => {
    it('should return 500 on unexpected error', async () => {
      (postRepository.findAll as jest.Mock).mockRejectedValueOnce(
        new Error('DB error')
      );
      req.params = {};
      req.query = {};

      await postController.list(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'DB error'
      });
    });
  });
});
