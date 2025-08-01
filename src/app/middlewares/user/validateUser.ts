import { body } from 'express-validator';

const userValidationRules = [
  body('email').isEmail().withMessage('Email inválido'),
  body('phone')
    .exists({ checkFalsy: true })
    .withMessage('Telefone é obrigatório')
    .matches(/^\d{10,11}$/)
    .withMessage(
      'O telefone deve ser um número válido do Brasil (10 ou 11 dígitos, ex: 11999999999)'
    ),
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Nome é obrigatório')
    .isLength({ min: 10 })
    .withMessage('Nome deve ter no mínimo 10 caracteres')
    .not()
    .matches(/\d/)
    .withMessage('Nome não pode conter números'),
  body('password')
    .isLength({ min: 6, max: 20 })
    .withMessage('A senha deve ter entre 6 à 20 caracteres')
    .matches(/[A-Z]/)
    .withMessage('Deve conter ao menos uma letra maiúscula')
    .matches(/[a-z]/)
    .withMessage('Deve conter ao menos uma letra minúscula')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('Deve conter ao menos um caractere especial')
];

export { userValidationRules };
