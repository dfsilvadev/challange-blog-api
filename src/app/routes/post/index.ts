import { Router } from 'express';

import * as postController from '../../controllers/postController';
import * as commentController from '../../controllers/commentController';

import {
  authenticateToken,
  authorizeRoles
} from '../../middlewares/auth/authenticationValidate';

import {
  postUpdateValidationRules,
  postValidationRules
} from '../../middlewares/post/validatePost';
import { validateUUID } from '../../middlewares/utils/validateUtils';

import { asyncHandler } from '../../../utils/asyncHandler';

import { validatePostFilters } from '../../middlewares/post/filtersValidator';

const router = Router();
const commentRouter = Router({ mergeParams: true });

/**
 * Posts routes
 * @route /post
 * @group Post - Operations about posts
 */

/* Rotas Autenticadas (Posts) */
router.post(
  '/',
  asyncHandler(authenticateToken),
  authorizeRoles(['teacher']),
  postValidationRules,
  postController.create
);
router.patch(
  '/:id',
  asyncHandler(authenticateToken),
  authorizeRoles(['teacher']),
  validateUUID,
  postUpdateValidationRules,
  postController.updateById
);
router.delete(
  '/:id',
  asyncHandler(authenticateToken),
  authorizeRoles(['teacher']),
  validateUUID,
  postController.removeById
);
router.get(
  '/createdBy/:userId',
  asyncHandler(authenticateToken),
  authorizeRoles(['teacher']),
  postController.listByUserId
);

/* Rotas Públicas (Posts) */
router.get('/filter', validatePostFilters, postController.listFilter);
router.get('/:id', validateUUID, postController.getById);
router.get('/', postController.list);
/* Rotas Públicas de Comentários Aninhadas */
commentRouter.get('/', validateUUID, commentController.list);
commentRouter.post('/', validateUUID, commentController.create);

// Use o router de comentários dentro do post
router.use('/:postId/comments', commentRouter);
export default router;
