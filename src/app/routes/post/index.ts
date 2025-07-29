import { Router } from 'express';

import { authenticateToken } from '../../middlewares/auth/authenticationValidate';
import { asyncHandler } from '../../../utils/asyncHandler';
import { removeById, getById } from '../../controllers/postController';
import { validateUUID } from '../../middlewares/utils/validateUtils';

const router = Router();

router.get('/:id', validateUUID, getById);

router.delete(
  '/:id',
  asyncHandler(authenticateToken),
  validateUUID,
  removeById
);

export default router;
