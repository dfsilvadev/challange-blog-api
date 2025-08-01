import { Request } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { postValidationRules } from '../../app/middlewares/post/validatePost';

const mockRequest = (body: any): Request => {
  return {
    body
  } as Request;
};

const runValidation = async (rules: ValidationChain[], req: Request) => {
  for (const rule of rules) {
    await rule.run(req);
  }
  return validationResult(req);
};

describe('Validações do postValidationRules (sem usar e.param)', () => {
  it('retorna erro se o título não for uma string', async () => {
    const req = mockRequest({ title: 123 });
    const result = await runValidation(postValidationRules, req);

    const errorMessages = result.array().map((e) => e.msg);
    expect(errorMessages).toContain('O Título deve ser uma string');
  });

  it('retorna erro se o conteúdo não for uma string', async () => {
    const req = mockRequest({ content: false });
    const result = await runValidation(postValidationRules, req);

    const errorMessages = result.array().map((e) => e.msg);
    expect(errorMessages).toContain('O Conteúdo deve ser uma string');
  });

  it('retorna erro se is_active não for booleano', async () => {
    const req = mockRequest({ is_active: 'sim' });
    const result = await runValidation(postValidationRules, req);

    const errorMessages = result.array().map((e) => e.msg);
    expect(errorMessages).toContain('O campo Ativo deve ser um booleano');
  });

  it('retorna erro se user_id não for um UUID válido', async () => {
    const req = mockRequest({ user_id: '123' });
    const result = await runValidation(postValidationRules, req);

    const errorMessages = result.array().map((e) => e.msg);
    expect(errorMessages).toContain('O Usuário deve ter um UUID válido');
  });

  it('retorna erro se category_id não for um UUID válido', async () => {
    const req = mockRequest({ category_id: 'abc' });
    const result = await runValidation(postValidationRules, req);

    const errorMessages = result.array().map((e) => e.msg);
    expect(errorMessages).toContain('A Categoria deve ter um UUID válido');
  });
});
