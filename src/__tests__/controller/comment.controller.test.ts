import { Request, Response } from 'express';
import * as commentController from '../../app/controllers/commentController';
import * as commentRepository from '../../app/repositories/commentRepository';
import * as postRepository from '../../app/repositories/postRepository';
import { mockPosts } from '../../utils/mocks/mockPost';
import { validateUUID } from '../../app/middlewares/utils/validateUtils';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../app/repositories/commentRepository', () => ({
  create: jest.fn(),
  findAllByPostId: jest.fn()
}));

jest.mock('../../app/repositories/postRepository', () => ({
  findById: jest.fn()
}));

describe('CommentController - create', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  const mockPost = mockPosts[0].id;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    req = { params: {}, body: {} };
    res = { status: statusMock };
    jest.clearAllMocks();
  });

  it('should return 404 if post does not exist', async () => {
    (postRepository.findById as jest.Mock).mockResolvedValueOnce(null);
    req.body = { post_id: mockPost };

    await commentController.create(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      error: true,
      details: 'NOT_FOUND_POST'
    });
    expect(commentRepository.create).not.toHaveBeenCalled();
  });

  it('should return 500 on unexpected error', async () => {
    const errorMessage = 'DB Error';
    (postRepository.findById as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    req.body = { post_id: mockPost };

    await commentController.create(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: true,
      details: errorMessage
    });
  });
});

describe('CommentController - list', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let next: jest.Mock;
  const mockPost = mockPosts[0].id;
  const mockComment = {
    id: uuidv4(),
    content: 'Conteúdo de Teste',
    author: 'Autor',
    post_id: mockPost,
    created_at: new Date(),
    updated_at: new Date()
  };

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    req = { params: {}, body: {} };
    res = { status: statusMock };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 404 if post does not exist', async () => {
    (postRepository.findById as jest.Mock).mockResolvedValueOnce(null);
    req.body = { post_id: mockPost };

    await commentController.list(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      error: true,
      details: 'NOT_FOUND_POST'
    });
    expect(commentRepository.create).not.toHaveBeenCalled();
  });

  it('should return categories', async () => {
    (postRepository.findById as jest.Mock).mockResolvedValueOnce(mockPosts[0]);
    (commentRepository.findAllByPostId as jest.Mock).mockResolvedValueOnce([
      mockComment
    ]);
    req.params = { postId: mockPost };

    validateUUID(req as Request, res as Response, next);
    await commentController.list(req as Request, res as Response);

    expect(postRepository.findById).toHaveBeenCalledWith(mockPost);
    expect(commentRepository.findAllByPostId).toHaveBeenCalledWith(mockPost);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'OK',
      details: [mockComment]
    });
  });

  it('should return 500 on unexpected error', async () => {
    const errorMessage = 'DB Error';
    (postRepository.findById as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    req.body = { post_id: mockPost };

    await commentController.list(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: true,
      details: errorMessage
    });
  });
});
