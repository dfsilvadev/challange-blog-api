import express from 'express';

import { listByUserId } from '../../controllers/postController';
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
router.get('/posts/:userId', asyncHandler(authenticateToken), listByUserId);

export default router;
