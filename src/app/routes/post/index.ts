import { Router } from 'express';

import { authenticateToken } from '../../middlewares/auth/authenticationValidate';
import { postValidationRules } from '../../middlewares/post/validatePost';

import { asyncHandler } from '../../../utils/asyncHandler';

import { removeById, getById, created } from '../../controllers/postController';

import { validateUUID } from '../../middlewares/utils/validateUtils';

const router = Router();

router.get('/:id', validateUUID, getById);

router.delete(
  '/:id',
  asyncHandler(authenticateToken),
  validateUUID,
  removeById
);

router.post('/', asyncHandler(authenticateToken), postValidationRules, created);

export default router;
