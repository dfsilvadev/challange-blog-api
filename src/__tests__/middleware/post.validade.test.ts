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

describe('Validações positivas do postValidationRules', () => {
  it('should pass if all required fields are valid', async () => {
    const req = mockRequest({
      title: 'Título válido com mais de vinte caracteres',
      content: 'Conteúdo válido com mais de cinquenta caracteres para testar.',
      is_active: true,
      user_id: '4536040b-22c5-4c38-a881-5966bf5b6cc3',
      category_id: '4536040b-22c5-4c38-a881-5966bf5b6cc3'
    });
    const result = await runValidation(postValidationRules, req);

    expect(result.isEmpty()).toBe(true);
  });

  it('should return error if title is less than 20 characters', async () => {
    const req = mockRequest({
      title: 'Curto',
      content: 'Conteúdo válido com mais de cinquenta caracteres para testar.',
      user_id: '4536040b-22c5-4c38-a881-5966bf5b6cc3',
      category_id: '4536040b-22c5-4c38-a881-5966bf5b6cc3'
    });
    const result = await runValidation(postValidationRules, req);
    const errorMessages = result.array().map((e) => e.msg);

    expect(errorMessages).toContain(
      'O Título deve ter no mínimo 20 caracteres'
    );
  });

  it('should return error if content is less than 50 characters', async () => {
    const req = mockRequest({
      title: 'Título válido com mais de vinte caracteres',
      content: 'Curto',
      user_id: '4536040b-22c5-4c38-a881-5966bf5b6cc3',
      category_id: '4536040b-22c5-4c38-a881-5966bf5b6cc3'
    });
    const result = await runValidation(postValidationRules, req);
    const errorMessages = result.array().map((e) => e.msg);

    expect(errorMessages).toContain(
      'O Conteúdo deve ter no mínimo 50 caracteres'
    );
  });

  it('should return error if title or content is missing', async () => {
    const req1 = mockRequest({
      content: 'Conteúdo válido com mais de cinquenta caracteres para testar.',
      user_id: '4536040b-22c5-4c38-a881-5966bf5b6cc3',
      category_id: '4536040b-22c5-4c38-a881-5966bf5b6cc3'
    });
    const req2 = mockRequest({
      title: 'Título válido com mais de vinte caracteres',
      user_id: '4536040b-22c5-4c38-a881-5966bf5b6cc3',
      category_id: '4536040b-22c5-4c38-a881-5966bf5b6cc3'
    });
    const result1 = await runValidation(postValidationRules, req1);
    const result2 = await runValidation(postValidationRules, req2);
    const errorMessages1 = result1.array().map((e) => e.msg);
    const errorMessages2 = result2.array().map((e) => e.msg);

    expect(errorMessages1).toContain('O Título é obrigatório');
    expect(errorMessages2).toContain('O Conteúdo é obrigatório');
  });
});
