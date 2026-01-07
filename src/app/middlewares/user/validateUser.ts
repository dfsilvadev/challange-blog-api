import { body, ValidationChain } from 'express-validator';

const PHONE_REGEX = /^\d{10,11}$/;
const VALID_ROLES = ['coordinator', 'teacher', 'student'];

const emailRule = (required = true): ValidationChain =>
  required
    ? body('email').isEmail().withMessage('Email inválido')
    : body('email').optional().isEmail().withMessage('Email inválido');

const phoneRule = (required = true): ValidationChain =>
  required
    ? body('phone')
        .exists({ checkFalsy: true })
        .withMessage('Telefone é obrigatório')
        .matches(PHONE_REGEX)
        .withMessage(
          'O telefone deve ser um número válido do Brasil (10 ou 11 dígitos, ex: 11999999999)'
        )
    : body('phone')
        .optional()
        .matches(PHONE_REGEX)
        .withMessage(
          'O telefone deve ser um número válido do Brasil (10 ou 11 dígitos, ex: 11999999999)'
        );

const nameRule = (required = true): ValidationChain =>
  required
    ? body('name')
        .exists({ checkFalsy: true })
        .withMessage('Nome é obrigatório')
        .isLength({ min: 10 })
        .withMessage('Nome deve ter no mínimo 10 caracteres')
        .not()
        .matches(/\d/)
        .withMessage('Nome não pode conter números')
    : body('name')
        .optional()
        .isLength({ min: 10 })
        .withMessage('Nome deve ter no mínimo 10 caracteres')
        .not()
        .matches(/\d/)
        .withMessage('Nome não pode conter números');

const passwordRule = (required = true): ValidationChain =>
  required
    ? body('password')
        .isLength({ min: 6, max: 20 })
        .withMessage('A senha deve ter entre 6 à 20 caracteres')
        .matches(/[A-Z]/)
        .withMessage('Deve conter ao menos uma letra maiúscula')
        .matches(/[a-z]/)
        .withMessage('Deve conter ao menos uma letra minúscula')
        .matches(/[^A-Za-z0-9]/)
        .withMessage('Deve conter ao menos um caractere especial')
    : body('password')
        .optional()
        .isLength({ min: 6, max: 20 })
        .withMessage('A senha deve ter entre 6 à 20 caracteres')
        .matches(/[A-Z]/)
        .withMessage('Deve conter ao menos uma letra maiúscula')
        .matches(/[a-z]/)
        .withMessage('Deve conter ao menos uma letra minúscula')
        .matches(/[^A-Za-z0-9]/)
        .withMessage('Deve conter ao menos um caractere especial');

const roleNameRule = (required = true): ValidationChain =>
  required
    ? body('roleName')
        .exists({ checkFalsy: true })
        .withMessage('Role é obrigatório')
        .isIn(VALID_ROLES)
        .withMessage('Role inválido')
    : body('roleName')
        .optional()
        .isIn(VALID_ROLES)
        .withMessage('Role inválido');

const userCreateValidationRules = [
  emailRule(true),
  phoneRule(true),
  nameRule(true),
  passwordRule(true),
  roleNameRule(true)
];

const userUpdateValidationRules = [
  body().custom((body) => {
    const allowedFields = ['email', 'phone', 'name', 'password', 'roleName'];
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
  emailRule(false),
  phoneRule(false),
  nameRule(false),
  passwordRule(false),
  roleNameRule(false)
];

export { userCreateValidationRules, userUpdateValidationRules };
