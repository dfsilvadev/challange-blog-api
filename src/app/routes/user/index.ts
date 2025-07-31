import express from 'express';

import * as postController from '../../controllers/postController';
import * as userController from '../../controllers/userController';

import { userValidationRules } from '../../middlewares/user/validateUser';

import { authenticateToken } from '../../middlewares/auth/authenticationValidate';

import { asyncHandler } from '../../../utils/asyncHandler';
import { validate } from '../../middlewares/utils/validateUtils';

const router = express.Router();

router.post('/', userValidationRules, validate, userController.create);
router.get('/:id', asyncHandler(authenticateToken), userController.findOne);
router.get(
  '/posts/:userId',
  asyncHandler(authenticateToken),
  postController.listByUserId
);

export default router;
