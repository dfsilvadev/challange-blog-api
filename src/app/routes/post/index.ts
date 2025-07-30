import { Router } from 'express';

import { getById, removeById } from '../../controllers/postController';

import { authenticateToken } from '../../middlewares/auth/authenticationValidate';
import { validateUUID } from '../../middlewares/utils/validateUtils';

import { asyncHandler } from '../../../utils/asyncHandler';

const router = Router();

router.get('/:id', validateUUID, getById);

router.delete(
  '/:id',
  asyncHandler(authenticateToken),
  validateUUID,
  removeById
);

export default router;
