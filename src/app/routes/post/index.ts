import { Router } from 'express';

import { authenticateToken } from '../../middlewares/auth/authenticationValidate';
import { asyncHandler } from '../../../utils/asyncHandler';
import { removeById } from '../../controllers/postController';

const router = Router();

router.delete('/:id', asyncHandler(authenticateToken), removeById);

export default router;
