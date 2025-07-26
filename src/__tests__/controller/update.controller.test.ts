import { Request, Response } from 'express';
import { updatePost } from '../../app/controllers/postController';

jest.mock('../../database/db', () => ({
  query: jest.fn()
}));

jest.mock('../../app/repositories/postRepository', () => ({
  updatePost: jest.fn()
}));

jest.mock('../../app/middlewares/handleValidation', () => ({
  validate: jest.fn((req, res, next) => next())
}));

jest.mock('../../app/middlewares/Post/validateUpdate', () => ({
  updatePostValidationRules: [],
  validateUpdatePost: jest.fn((req, res, next) => {
    next();
  })
}));

describe('updatePost Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    const updatePayload = {
      title: 'Updated Title',
      content: 'Updated Content',
      is_active: true,
      category_id: 'some-category-uuid'
    };

    mockRequest = {
      params: { id: 'some-uuid-id' },
      body: updatePayload,
      updateData: updatePayload
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should update a post successfully and return 200', async () => {
    const postRepository = require('../../app/repositories/postRepository');

    const mockUpdatedPost = {
      id: 'some-uuid-id',
      title: 'Updated Title',
      content: 'Updated Content',
      is_active: true,
      category_id: 'some-category-uuid',
      user_id: 'some-user-id'
    };

    postRepository.updatePost.mockResolvedValue(mockUpdatedPost);

    await updatePost(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(postRepository.updatePost).toHaveBeenCalledWith('some-uuid-id', {
      title: 'Updated Title',
      content: 'Updated Content',
      is_active: true,
      category_id: 'some-category-uuid'
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Post atualizado com sucesso!',
      post: mockUpdatedPost
    });
  });

  it('should return 404 if post is not found', async () => {
    const postRepository = require('../../app/repositories/postRepository');
    postRepository.updatePost.mockResolvedValue(null);

    await updatePost(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(postRepository.updatePost).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Post não encontrado.'
    });
  });

  it('should return 500 if an error occurs during update', async () => {
    const postRepository = require('../../app/repositories/postRepository');
    postRepository.updatePost.mockRejectedValue(new Error('Database error'));

    await updatePost(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(postRepository.updatePost).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Erro ao atualizar o post.'
    });
  });
});
