import { Request, Response } from 'express';
import { validaTitle } from '../../app/middlewares/Post/validarTitle';
import { validaContent } from '../../app/middlewares/Post/validarContent';
import { validaIsActive } from '../../app/middlewares/Post/validarIsActive';
import { validarUser } from '../../app/middlewares/Post/validarUser';
import { validarCategory } from '../../app/middlewares/Post/validarCategory';
import * as userRepository from '../../app/repositories/userRepository';
import { query } from '../../database/db';

jest.mock('../../app/repositories/userRepository');
jest.mock('../../database/db');

describe('Middlewares', () => {
  let next: jest.Mock;
  let res: Response;

  const validUuid = '3f2504e0-4f89-11d3-9a0c-0305e82c3301';

  beforeEach(() => {
    next = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
  });

  describe('validaTitle', () => {
    it('passa se válido', () => {
      const req = { body: { title: 'Título' } } as Request;
      validaTitle(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('falha se inválido', () => {
      const req = { body: {} } as Request;
      validaTitle(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        details: 'INVALID_TITLE'
      });
    });
  });

  describe('validaContent', () => {
    it('passa se válido', () => {
      const req = { body: { content: 'Conteúdo' } } as Request;
      validaContent(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('falha se inválido', () => {
      const req = { body: {} } as Request;
      validaContent(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        details: 'INVALID_CONTENT'
      });
    });
  });

  describe('validaIsActive', () => {
    it('passa se boolean', () => {
      const req = { body: { is_active: true } } as Request;
      validaIsActive(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('falha se não boolean', () => {
      const req = { body: { is_active: 'sim' } } as Request;
      validaIsActive(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        details: 'INVALID_IS_ACTIVE'
      });
    });
  });

  describe('validarUser', () => {
    it('passa se user existe', async () => {
      (userRepository.existsById as jest.Mock).mockResolvedValueOnce(true);
      const req = { body: { user_id: validUuid } } as Request;
      await validarUser(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('falha se UUID inválido', async () => {
      const req = { body: { user_id: 'invalido' } } as Request;
      await validarUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        details: 'INVALID_UUID'
      });
    });

    it('falha se user não existe', async () => {
      (userRepository.existsById as jest.Mock).mockResolvedValueOnce(false);
      const req = { body: { user_id: validUuid } } as Request;
      await validarUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        details: 'USER_NOT_FOUND'
      });
    });
  });

  describe('validarCategory', () => {
    it('passa se category existe', async () => {
      (query as jest.Mock).mockResolvedValueOnce([{ exists: true }]);
      const req = { body: { category_id: validUuid } } as Request;
      await validarCategory(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('falha se UUID inválido', async () => {
      const req = { body: { category_id: 'invalido' } } as Request;
      await validarCategory(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        details: 'INVALID_UUID'
      });
    });

    it('falha se category não existe', async () => {
      (query as jest.Mock).mockResolvedValueOnce([{ exists: false }]);
      const req = { body: { category_id: validUuid } } as Request;
      await validarCategory(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        details: 'CATEGORY_NOT_FOUND'
      });
    });
  });
});
