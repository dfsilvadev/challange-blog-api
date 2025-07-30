import { Router } from 'express';

import { created, getById, removeById } from '../../controllers/postController';

import { authenticateToken } from '../../middlewares/auth/authenticationValidate';
import { postValidationRules } from '../../middlewares/post/validatePost';
import { validateUUID } from '../../middlewares/utils/validateUtils';

import { asyncHandler } from '../../../utils/asyncHandler';

const router = Router();

router.get('/:id', validateUUID, getById);
router.post('/', asyncHandler(authenticateToken), postValidationRules, created);
router.delete(
  '/:id',
  asyncHandler(authenticateToken),
  validateUUID,
  removeById
);

export default router;
