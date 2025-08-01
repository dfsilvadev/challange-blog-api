import { body } from 'express-validator';

const postValidationRules = [
  body('title')
    .exists({ checkFalsy: true })
    .withMessage('O Título é obrigatório')
    .isString()
    .withMessage('O Título deve ser uma string')
    .isLength({ min: 20 })
    .withMessage('O Título deve ter no mínimo 20 caracteres'),
  body('content')
    .exists({ checkFalsy: true })
    .withMessage('O Conteúdo é obrigatório')
    .isString()
    .withMessage('O Conteúdo deve ser uma string')
    .isLength({ min: 50 })
    .withMessage('O Conteúdo deve ter no mínimo 50 caracteres'),
  body('is_active')
    .isBoolean()
    .withMessage('O campo Ativo deve ser um booleano'),
  body('user_id').isUUID().withMessage('O Usuário deve ter um UUID válido'),
  body('category_id')
    .isUUID()
    .withMessage('A Categoria deve ter um UUID válido')
];

const postUpdateValidationRules = [
  body().custom((body) => {
    const allowedFields = [
      'title',
      'content',
      'is_active',
      'user_id',
      'category_id'
    ];
    const hasAtLeastOne = allowedFields.some(
      (field) => body[field] !== undefined
    );
    if (!hasAtLeastOne) {
      throw new Error(
        'Pelo menos um campo deve ser fornecido para atualização'
      );
    }
    return true;
  }),
  body('title')
    .optional()
    .isString()
    .withMessage('O Título deve ser uma string')
    .isLength({ max: 150 })
    .withMessage('O Título deve ter no máximo 150 caracteres'),
  body('content')
    .optional()
    .isString()
    .withMessage('O Conteúdo deve ser uma string'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('O campo Ativo deve ser um booleano'),
  body('user_id')
    .optional()
    .isUUID()
    .withMessage('O Usuário deve ter um UUID válido'),
  body('category_id')
    .optional()
    .isUUID()
    .withMessage('A Categoria deve ter um UUID válido')
];

export { postUpdateValidationRules, postValidationRules };
