import { Router } from 'express';

import { authenticateToken } from '../../middlewares/auth/authenticationValidate';
import { asyncHandler } from '../../../utils/asyncHandler';
import { removeById } from '../../controllers/postController';
import { validarUUID } from '../../middlewares/utils/validateUtils';

const router = Router();

router.delete('/:id', asyncHandler(authenticateToken), validarUUID, removeById);

export default router;
