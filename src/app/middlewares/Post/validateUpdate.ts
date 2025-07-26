import { Request, Response, NextFunction, RequestHandler } from 'express'; // Adicionado RequestHandler aqui
import { body, ValidationChain } from 'express-validator';

declare module 'express' {
  export interface Request {
    updateData?: {
      title?: string;
      content?: string;
      is_active?: boolean;
      category_id?: string;
    };
  }
}

// Middleware para construir o objeto updateData e verificar se há dados para atualização
export const validateUpdatePost: RequestHandler = (
  // Agora RequestHandler está definido
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, content, is_active, category_id } = req.body;

  const updateData: {
    title?: string;
    content?: string;
    is_active?: boolean;
    category_id?: string;
  } = {};

  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;
  if (is_active !== undefined) updateData.is_active = is_active;
  if (category_id !== undefined) updateData.category_id = category_id;

  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ error: 'Nenhum dado fornecido para atualização.' });
  }

  req.updateData = updateData;
  next();
};

// Regras de validação do express-validator para os campos do post
export const updatePostValidationRules: ValidationChain[] = [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('O título não pode ser vazio se fornecido.')
    .isString()
    .withMessage('O título deve ser uma string.')
    .isLength({ min: 5 })
    .withMessage('O título deve ter no mínimo 5 caracteres.'),
  body('content')
    .optional()
    .notEmpty()
    .withMessage('O conteúdo não pode ser vazio se fornecido.')
    .isString()
    .withMessage('O conteúdo deve ser uma string.'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('O status de ativo deve ser um valor booleano.'),
  body('category_id')
    .optional()
    .isUUID()
    .withMessage('O ID da categoria deve ser um UUID válido.')
];
