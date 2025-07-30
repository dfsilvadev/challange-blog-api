import { Router } from 'express';

import { authenticateToken } from '../../middlewares/auth/authenticationValidate';
import { asyncHandler } from '../../../utils/asyncHandler';
import {
  removeById,
  getById,
  getByFilter
} from '../../controllers/postController';
import {
  validateUUID,
  validateFilterQuery
} from '../../middlewares/utils/validateUtils';

const router = Router();

router.get(
  '/filter',
  asyncHandler(authenticateToken),
  validateFilterQuery,
  getByFilter
);
router.get('/:id', validateUUID, getById);

router.delete(
  '/:id',
  asyncHandler(authenticateToken),
  validateUUID,
  removeById
);

export default router;
