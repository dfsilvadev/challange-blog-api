import { Request, Response, NextFunction } from 'express';

type AsyncMiddleware = (
  _req: Request,
  _res: Response,
  _next: NextFunction
) => Promise<any>;

export const asyncHandler =
  (fn: AsyncMiddleware) =>
  (_req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(_req, res, next)).catch(next);
  };
