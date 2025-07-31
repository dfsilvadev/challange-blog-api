import express from 'express';

import * as postController from '../../controllers/postController';
import * as userController from '../../controllers/userController';

import { userValidationRules } from '../../middlewares/user/validateUser';

import { authenticateToken } from '../../middlewares/auth/authenticationValidate';

import { asyncHandler } from '../../../utils/asyncHandler';
import { validate } from '../../middlewares/utils/validateUtils';

const router = express.Router();

/**
 * User routes
 * @route /user
 * @group User - Operations about users
 */
/* Authenticated routes */
router.get('/:id', asyncHandler(authenticateToken), userController.findOne);
router.get(
  '/posts/:userId',
  asyncHandler(authenticateToken),
  postController.listByUserId
);

/* Public routes */
router.post('/', userValidationRules, validate, userController.create);

export default router;
