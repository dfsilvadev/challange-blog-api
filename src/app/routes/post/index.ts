import { Router } from 'express';

import * as postController from '../../controllers/postController';

import { authenticateToken } from '../../middlewares/auth/authenticationValidate';

import {
  postUpdateValidationRules,
  postValidationRules
} from '../../middlewares/post/validatePost';
import { validateUUID } from '../../middlewares/utils/validateUtils';

import { asyncHandler } from '../../../utils/asyncHandler';

import { validatePostFilters } from '../../middlewares/post/filtersValidator';

const router = Router();

/**
 * Posts routes
 * @route /post
 * @group Post - Operations about posts
 */

/* Authenticated routes */
router.post(
  '/',
  asyncHandler(authenticateToken),
  postValidationRules,
  postController.create
);
router.patch(
  '/:id',
  asyncHandler(authenticateToken),
  validateUUID,
  postUpdateValidationRules,
  postController.updateById
);
router.delete(
  '/:id',
  asyncHandler(authenticateToken),
  validateUUID,
  postController.removeById
);
router.get(
  '/createdBy/:userId',
  asyncHandler(authenticateToken),
  postController.listByUserId
);

/* Public routes */
router.get('/filter', validatePostFilters, postController.listFilter);
router.get('/:id', validateUUID, postController.getById);
router.get('/', postController.list);
export default router;
