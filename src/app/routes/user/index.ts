import express from 'express';

import { listByUserId } from '../../controllers/postController';
import { createUser, getUser } from '../../controllers/userController';

import { userValidationRules } from '../../middlewares/user/validateUser';

import { authenticateToken } from '../../middlewares/auth/authenticationValidate';

import { asyncHandler } from '../../../utils/asyncHandler';
import { validate } from '../../middlewares/utils/validateUtils';

const router = express.Router();

router.post('/', userValidationRules, validate, createUser);
router.get('/:id', asyncHandler(authenticateToken), getUser);
router.get('/posts/:userId', asyncHandler(authenticateToken), listByUserId);

export default router;
