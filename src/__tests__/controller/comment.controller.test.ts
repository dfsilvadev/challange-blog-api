import { Request, Response } from 'express';
import * as commentController from '../../app/controllers/commentController';
import * as commentRepository from '../../app/repositories/commentRepository';
import * as postRepository from '../../app/repositories/postRepository';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../app/repositories/commentRepository');
jest.mock('../../app/repositories/postRepository');

describe('CommentController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  const mockPostId = uuidv4();
  const mockComment = {
    id: uuidv4(),
    conteudo: 'Conteúdo de Teste',
    autor_nome: 'Autor',
    post_id: mockPostId,
    created_at: new Date(),
    updated_at: new Date()
  };

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock })) as any;
    req = { params: {}, body: {} };
    res = { status: statusMock };
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should return 404 if post does not exist', async () => {
      (postRepository.findById as jest.Mock).mockResolvedValueOnce(null);
      req.body = { post_id: mockPostId };

      await commentController.create(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'NOT_FOUND_POST'
      });
      expect(commentRepository.create).not.toHaveBeenCalled();
    });

    it('should return 201 and created comment on success', async () => {
      (postRepository.findById as jest.Mock).mockResolvedValueOnce({
        id: mockPostId
      });
      (commentRepository.create as jest.Mock).mockResolvedValueOnce(
        mockComment
      );
      req.body = { ...mockComment, post_id: mockPostId };

      await commentController.create(req as Request, res as Response);

      expect(postRepository.findById).toHaveBeenCalledWith(mockPostId);
      expect(commentRepository.create).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'OK',
        details: mockComment
      });
    });

    it('should return 500 on unexpected error', async () => {
      const errorMessage = 'DB Error';
      (postRepository.findById as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await commentController.create(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: errorMessage
      });
    });
  });

  describe('list', () => {
    it('should return 404 if post does not exist', async () => {
      (postRepository.findById as jest.Mock).mockResolvedValueOnce(null);
      req.params = { postId: mockPostId };

      await commentController.list(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'NOT_FOUND_POST'
      });
      expect(commentRepository.findAllByPostId).not.toHaveBeenCalled();
    });

    it('should return 200 and list of comments on success', async () => {
      const mockList = [mockComment];
      (postRepository.findById as jest.Mock).mockResolvedValueOnce({
        id: mockPostId
      });
      (commentRepository.findAllByPostId as jest.Mock).mockResolvedValueOnce(
        mockList
      );
      req.params = { postId: mockPostId };

      await commentController.list(req as Request, res as Response);

      expect(commentRepository.findAllByPostId).toHaveBeenCalledWith(
        mockPostId
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'OK',
        details: mockList
      });
    });

    it('should return 500 on unexpected error', async () => {
      const errorMessage = 'DB Error on list';
      (postRepository.findById as jest.Mock).mockResolvedValueOnce({
        id: mockPostId
      });
      (commentRepository.findAllByPostId as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );
      req.params = { postId: mockPostId };

      await commentController.list(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: errorMessage
      });
    });
  });
});
