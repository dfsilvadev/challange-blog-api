import { Request, Response } from 'express'; // Removido NextFunction, pois era reportado como não utilizado
import { validationResult, ValidationChain } from 'express-validator';
import { commentValidationRules } from '../../app/middlewares/comment/validateComment';
import { validate } from '../../app/middlewares/utils/validateUtils';

// 1. Mocka a função validationResult do express-validator para controlarmos o resultado
jest.mock('express-validator', () => {
  const actual = jest.requireActual('express-validator');
  return {
    ...actual,
    validationResult: jest.fn() // Mocka a função
  };
});

// 2. Cria um alias tipado para acessar os métodos mock do Jest de forma correta
const mockValidationResult = validationResult as jest.MockedFunction<
  typeof validationResult
>;

// Helper para rodar apenas as ValidationChains
const runValidationChains = async (
  rules: ValidationChain[],
  requestObject: Request
) => {
  for (const rule of rules) {
    // CORREÇÃO: Variável 'req' na tipagem alterada para '_req' (ou _requestObject)
    await (rule as unknown as { run: (_req: Request) => Promise<any> }).run(
      requestObject
    );
  }
};

// Configuração básica de Request/Response
const mockRequest = (body: any): Request => ({ body }) as Request;
const mockResponse = () =>
  ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  }) as unknown as Response;
const mockNext = jest.fn();

// O array completo é [Chain1, Chain2, Chain2, ..., validate].
// Separamos as regras (todos os elementos, exceto o último, que é o 'validate' final)
const validationChains = commentValidationRules.slice(
  0,
  -1
) as ValidationChain[];

describe('commentValidationRules', () => {
  const validUUID = '4536040b-22c5-4c38-a881-5966bf5b6cc3';
  const validBody = {
    conteudo: 'Comentário com mais de 1 caracter.',
    autor_nome: 'Nome Completo Válido',
    post_id: validUUID
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Teste que garante que a validação passa com dados válidos
  it('should pass validation with valid body (final validate is called)', async () => {
    // CORREÇÃO: Variável 'req' local renomeada para 'requestObject'
    const requestObject = mockRequest(validBody);
    const res = mockResponse();

    // Sobrescreve o mock para SIMULAR que NÃO HÁ erros
    mockValidationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => []
    } as any);

    // 1. Roda as cadeias de validação
    await runValidationChains(validationChains, requestObject);

    // 2. Roda o middleware 'validate' manualmente
    validate(requestObject, res, mockNext);

    // Deve chamar o next, indicando que a validação passou
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  // Teste de Conteúdo (RN: Obrigatório, min 1, max 500)
  it('should return 422 if conteudo is missing', async () => {
    const requestObject = mockRequest({ ...validBody, conteudo: '' });
    const res = mockResponse();

    // Simula os erros de validação
    mockValidationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'O Conteúdo do comentário é obrigatório' }]
    } as any);

    await runValidationChains(validationChains, requestObject);

    validate(requestObject, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: true,
        details: expect.arrayContaining([
          'O Conteúdo do comentário é obrigatório'
        ])
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  // Teste de Autor Nome (RN: Obrigatório, min 3, max 100)
  it('should return 422 if autor_nome is too short', async () => {
    const requestObject = mockRequest({ ...validBody, autor_nome: 'AB' });
    const res = mockResponse();

    mockValidationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'O Nome deve ter entre 3 e 100 caracteres' }]
    } as any);

    await runValidationChains(validationChains, requestObject);

    validate(requestObject, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: true,
        details: expect.arrayContaining([
          'O Nome deve ter entre 3 e 100 caracteres'
        ])
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  // Teste de Post ID (RN: Deve ser UUID)
  it('should return 422 if post_id is invalid UUID', async () => {
    const requestObject = mockRequest({ ...validBody, post_id: 'invalid-id' });
    const res = mockResponse();

    mockValidationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'O ID do post deve ser um UUID válido' }]
    } as any);

    await runValidationChains(validationChains, requestObject);

    validate(requestObject, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: true,
        details: expect.arrayContaining([
          'O ID do post deve ser um UUID válido'
        ])
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });
});
