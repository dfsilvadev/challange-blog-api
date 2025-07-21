import express from 'express';
import { createUser, getUser } from '../../controllers/userController';
import {
  userValidationRules,
  validate
} from '../../middlewares/user/userValidate';
import { authenticateToken } from '../../middlewares/auth/authenticationValidate';
import { asyncHandler } from '../../../utils/asyncHandler';

const router = express.Router();

router.post('/', userValidationRules, validate, createUser);

router.get('/:id', asyncHandler(authenticateToken), getUser);

export default router;
