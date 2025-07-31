import { Router } from 'express';

import {
  created,
  getById,
  list,
  removeById,
  updateById
} from '../../controllers/postController';

import { authenticateToken } from '../../middlewares/auth/authenticationValidate';

import {
  postUpdateValidationRules,
  postValidationRules
} from '../../middlewares/post/validatePost';
import { validateUUID } from '../../middlewares/utils/validateUtils';

import { asyncHandler } from '../../../utils/asyncHandler';

const router = Router();

/**
 * Posts routes
 * @route /post
 * @group Post - Operations about posts
 */

/* Authenticated routes */
router.post('/', asyncHandler(authenticateToken), postValidationRules, created);
router.patch(
  '/:id',
  asyncHandler(authenticateToken),
  validateUUID,
  postUpdateValidationRules,
  updateById
);
router.delete(
  '/:id',
  asyncHandler(authenticateToken),
  validateUUID,
  removeById
);

/* Public routes */
router.get('/:id', validateUUID, getById);
router.get('/', list);

export default router;
