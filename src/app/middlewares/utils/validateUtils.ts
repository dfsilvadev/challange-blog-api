import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { isUUID } from 'validator';

const validateUUID = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Procura o primeiro parâmetro de rota que pareça ser um UUID
  const uuidParam =
    req.params.id ||
    req.params.postId ||
    req.params.userId ||
    req.params.commentId;

  // Caso não exista nenhum parâmetro de UUID
  if (!uuidParam) {
    res.status(400).json({ error: true, details: 'UUID_PARAM_NOT_FOUND' });
    return;
  }

  // Caso o valor não seja um UUID válido
  if (!isUUID(uuidParam)) {
    res.status(400).json({ error: true, details: 'INVALID_UUID' });
    return;
  }

  next();
};

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  const extractedErrors: string[] = [];

  errors.array().forEach((err) => extractedErrors.push(err.msg));

  return res.status(422).json({
    error: true,
    details: extractedErrors
  });
};

export { validate, validateUUID };
