import { postValidationRules } from '../../app/middlewares/post/validatePost';
import { validationResult, ValidationChain } from 'express-validator';
import { Request } from 'express';

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

  it('passa se todos os campos forem válidos', async () => {
    const req = mockRequest({
      title: 'Título válido',
      content: 'Conteúdo válido',
      is_active: true,
      user_id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
      category_id: 'c0a8012e-7f4f-4f33-b3b2-9a47f845a6aa'
    });

    const result = await runValidation(postValidationRules, req);
    expect(result.isEmpty()).toBe(true);
  });
});
