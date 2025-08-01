import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';

describe('asyncHandler middleware', () => {
  it('should call the async function without errors', async () => {
    const req = {} as Request;
    const res = { send: jest.fn() } as unknown as Response;
    const next = jest.fn();

    const fn = async (req: Request, res: Response) => {
      res.send('ok');
    };

    const middleware = asyncHandler(fn);

    middleware(req, res, next);

    await new Promise(process.nextTick);

    expect(res.send).toHaveBeenCalledWith('ok');
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with the error if the async function throws an error', async () => {
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    const erro = new Error('falha');

    const fn = async () => {
      throw erro;
    };

    const middleware = asyncHandler(fn);

    middleware(req, res, next);

    await new Promise(process.nextTick);

    expect(next).toHaveBeenCalledWith(erro);
  });
});
