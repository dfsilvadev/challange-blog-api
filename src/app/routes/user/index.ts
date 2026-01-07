import express from 'express';

import * as userController from '../../controllers/userController';

import {
  userCreateValidationRules,
  userUpdateValidationRules
} from '../../middlewares/user/validateUser';

import {
  authenticateToken,
  authorizeRoles
} from '../../middlewares/auth/authenticationValidate';

import { asyncHandler } from '../../../utils/asyncHandler';
import { validate } from '../../middlewares/utils/validateUtils';
import { validateUUID } from '../../middlewares/utils/validateUtils';

const router = express.Router();

/**
 * User routes
 * @route /user
 * @group User - Operations about users
 */
/* Authenticated routes */
router.get(
  '/:id',
  asyncHandler(authenticateToken),
  authorizeRoles(['coordinator']),
  validateUUID,
  userController.findOne
);
router.get(
  '/',
  asyncHandler(authenticateToken),
  authorizeRoles(['coordinator']),
  userController.listAll
);
router.patch(
  '/:id',
  asyncHandler(authenticateToken),
  authorizeRoles(['coordinator']),
  userUpdateValidationRules,
  validateUUID,
  userController.updateById
);
router.delete(
  '/:id',
  asyncHandler(authenticateToken),
  authorizeRoles(['coordinator']),
  validateUUID,
  userController.removeById
);
router.post(
  '/',
  asyncHandler(authenticateToken),
  authorizeRoles(['coordinator']),
  userCreateValidationRules,
  validate,
  userController.create
);

/* Public routes */

export default router;
