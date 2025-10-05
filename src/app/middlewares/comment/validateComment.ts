import { body } from 'express-validator';
import { validate } from '../utils/validateUtils';

const commentValidationRules = [
  body('content')
    .exists({ checkFalsy: true })
    .withMessage('O Conteúdo do comentário é obrigatório')
    .isString()
    .withMessage('O Conteúdo deve ser uma string')
    .isLength({ min: 1, max: 500 })
    .withMessage('O comentário deve ter entre 1 e 500 caracteres'),
  body('author')
    .exists({ checkFalsy: true })
    .withMessage('O Nome do autor é obrigatório')
    .isString()
    .withMessage('O Nome deve ser uma string')
    .isLength({ min: 3, max: 100 })
    .withMessage('O Nome deve ter entre 3 e 100 caracteres'),
  body('post_id').isUUID().withMessage('O ID do post deve ser um UUID válido')
];

// O middleware 'validate' lida com a resposta de erro 422
const validateComment = [...commentValidationRules, validate];

export { validateComment as commentValidationRules };
