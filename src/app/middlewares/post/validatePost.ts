import { body } from 'express-validator';

const postValidationRules = [
  body('title').isString().withMessage('O Título deve ser uma string'),
  body('content').isString().withMessage('O Conteúdo deve ser uma string'),
  body('is_active')
    .isBoolean()
    .withMessage('O campo Ativo deve ser um booleano'),
  body('user_id').isUUID().withMessage('O Usuário deve ter um UUID válido'),
  body('category_id')
    .isUUID()
    .withMessage('A Categoria deve ter um UUID válido')
];

export { postValidationRules };
