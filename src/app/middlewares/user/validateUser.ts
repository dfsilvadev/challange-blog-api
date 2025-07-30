import { body } from 'express-validator';

const userValidationRules = [
  body('email').isEmail().withMessage('Email inválido'),
  body('phone')
    .matches(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/)
    .withMessage('O Telefone não está no formato correto'),
  body('name')
    .not()
    .matches(/\d/)
    .withMessage('Não pode conter números no nome'),
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
