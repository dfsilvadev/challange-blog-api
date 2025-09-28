import { Request, Response } from 'express';
import * as comentarioController from '../../app/controllers/comentarioController';
import * as comentarioRepository from '../../app/repositories/comentarioRepository';
import * as postRepository from '../../app/repositories/postRepository';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../app/repositories/comentarioRepository');
jest.mock('../../app/repositories/postRepository');

describe('ComentarioController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  const mockPostId = uuidv4();
  const mockComentario = {
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

      await comentarioController.create(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'NOT_FOUND_POST'
      });
      expect(comentarioRepository.create).not.toHaveBeenCalled();
    });

    it('should return 201 and created comment on success', async () => {
      (postRepository.findById as jest.Mock).mockResolvedValueOnce({
        id: mockPostId
      });
      (comentarioRepository.create as jest.Mock).mockResolvedValueOnce(
        mockComentario
      );
      req.body = { ...mockComentario, post_id: mockPostId };

      await comentarioController.create(req as Request, res as Response);

      expect(postRepository.findById).toHaveBeenCalledWith(mockPostId);
      expect(comentarioRepository.create).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'OK',
        details: mockComentario
      });
    });

    it('should return 500 on unexpected error', async () => {
      const errorMessage = 'DB Error';
      (postRepository.findById as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await comentarioController.create(req as Request, res as Response);

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

      await comentarioController.list(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: 'NOT_FOUND_POST'
      });
      expect(comentarioRepository.findAllByPostId).not.toHaveBeenCalled();
    });

    it('should return 200 and list of comments on success', async () => {
      const mockList = [mockComentario];
      (postRepository.findById as jest.Mock).mockResolvedValueOnce({
        id: mockPostId
      });
      (comentarioRepository.findAllByPostId as jest.Mock).mockResolvedValueOnce(
        mockList
      );
      req.params = { postId: mockPostId };

      await comentarioController.list(req as Request, res as Response);

      expect(comentarioRepository.findAllByPostId).toHaveBeenCalledWith(
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
      (comentarioRepository.findAllByPostId as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );
      req.params = { postId: mockPostId };

      await comentarioController.list(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: true,
        details: errorMessage
      });
    });
  });
});
