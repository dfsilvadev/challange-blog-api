import { asyncHandler } from '../../utils/asyncHandler';
import { Request, Response } from 'express';

describe('asyncHandler middleware', () => {
  it('deve chamar a função async sem erros', async () => {
    const req = {} as Request;
    const res = { send: jest.fn() } as unknown as Response;
    const next = jest.fn();

    // Função async que resolve normalmente
    const fn = async (req: Request, res: Response) => {
      res.send('ok');
    };

    // Cria o middleware usando asyncHandler
    const middleware = asyncHandler(fn);

    // Chama o middleware (note que ele não retorna promise, pois não é async)
    middleware(req, res, next);

    // Espera o evento do nextTick para garantir promise resolvida
    await new Promise(process.nextTick);

    expect(res.send).toHaveBeenCalledWith('ok');
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next com o erro se a função async lançar erro', async () => {
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    const erro = new Error('falha');

    // Função async que rejeita
    const fn = async () => {
      throw erro;
    };

    const middleware = asyncHandler(fn);

    middleware(req, res, next);

    // Espera o próximo tick para a promise rejeitar
    await new Promise(process.nextTick);

    expect(next).toHaveBeenCalledWith(erro);
  });
});
