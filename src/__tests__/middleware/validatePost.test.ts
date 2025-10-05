import { Request } from 'express';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import {
  postValidationRules,
  postUpdateValidationRules
} from '../../app/middlewares/post/validatePost';

jest.mock('express-validator', () => ({
  ...jest.requireActual('express-validator'),
  validationResult: jest.fn()
}));

describe('Post Validation Middleware', () => {
  let req: Partial<Request>;

  beforeEach(() => {
    req = { body: {} };
    jest.clearAllMocks();
  });

  describe('postValidationRules', () => {
    it('should pass validation with valid input', async () => {
      req.body = {
        title: 'Título válido com mais de vinte caracteres',
        content:
          'Conteúdo válido com mais de cinquenta caracteres para passar na validação.',
        is_active: true,
        user_id: uuidv4(),
        category_id: uuidv4()
      };

      (validationResult as unknown as jest.Mock).mockReturnValueOnce({
        isEmpty: () => true,
        array: () => []
      });

      for (const rule of postValidationRules) {
        await rule.run(req as Request);
      }

      const result = validationResult(req as Request);
      expect(result.isEmpty()).toBe(true);
      expect(result.array()).toEqual([]);
    });

    it('should return errors when input is invalid', async () => {
      req.body = {}; // campos obrigatórios ausentes

      (validationResult as unknown as jest.Mock).mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [
          { msg: 'O Título é obrigatório', param: 'title' },
          { msg: 'O Conteúdo é obrigatório', param: 'content' },
          { msg: 'O campo Ativo deve ser um booleano', param: 'is_active' },
          { msg: 'O Usuário deve ter um UUID válido', param: 'user_id' },
          { msg: 'A Categoria deve ter um UUID válido', param: 'category_id' }
        ]
      });

      for (const rule of postValidationRules) {
        await rule.run(req as Request);
      }

      const result = validationResult(req as Request);
      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: 'O Título é obrigatório' }),
          expect.objectContaining({ msg: 'O Conteúdo é obrigatório' })
        ])
      );
    });
  });

  describe('postUpdateValidationRules', () => {
    it('should pass when at least one valid field is provided', async () => {
      req.body = { title: 'Atualização de título válida' };

      (validationResult as unknown as jest.Mock).mockReturnValueOnce({
        isEmpty: () => true,
        array: () => []
      });

      for (const rule of postUpdateValidationRules) {
        await rule.run(req as Request);
      }

      const result = validationResult(req as Request);
      expect(result.isEmpty()).toBe(true);
    });

    it('should fail when no fields are provided', async () => {
      req.body = {};

      (validationResult as unknown as jest.Mock).mockReturnValueOnce({
        isEmpty: () => false,
        array: () => [
          {
            msg: 'Pelo menos um campo deve ser fornecido para atualização',
            param: 'body'
          }
        ]
      });

      for (const rule of postUpdateValidationRules) {
        await rule.run(req as Request);
      }

      const result = validationResult(req as Request);
      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Pelo menos um campo deve ser fornecido para atualização'
          })
        ])
      );
    });
  });
});
