import { Router } from 'express';

import * as postController from '../../controllers/postController';
import * as commentController from '../../controllers/commentController';

import { authenticateToken } from '../../middlewares/auth/authenticationValidate';

import {
  postUpdateValidationRules,
  postValidationRules
} from '../../middlewares/post/validatePost';
import { validateUUID } from '../../middlewares/utils/validateUtils';

import { asyncHandler } from '../../../utils/asyncHandler';

import { validatePostFilters } from '../../middlewares/post/filtersValidator';
import { commentValidationRules } from '../../middlewares/comment/validateComment'; // Importa o middleware de validação

const router = Router();
const commentRouter = Router({ mergeParams: true });

/**
 * Posts routes
 * @route /post
 * @group Post - Operations about posts
 */

/* Rotas de Comentários Aninhadas (CORRIGIDAS) */
commentRouter.post(
  '/:postId/comments',
  ...commentValidationRules, // Espalha as regras de validação
  asyncHandler(commentController.create) // <-- AGORA COM asyncHandler
);
commentRouter.get(
  '/:postId/comments',
  validateUUID,
  asyncHandler(commentController.list) // <-- AGORA COM asyncHandler
);
router.use(commentRouter);

/* Rotas Autenticadas (Posts) */
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

/* Rotas Públicas (Posts) */
router.get('/filter', validatePostFilters, postController.listFilter);
router.get('/:id', validateUUID, postController.getById);
router.get('/', postController.list);

export default router;
