import express from 'express';
import { createUser, getUser } from '../../controllers/userController';
import { userValidationRules } from '../../middlewares/user/validateUser';
import { validate } from '../../middlewares/utils/validateUtils';
import { authenticateToken } from '../../middlewares/auth/authenticationValidate';
import { asyncHandler } from '../../../utils/asyncHandler';

const router = express.Router();

router.post('/', userValidationRules, validate, createUser);

router.get('/:id', asyncHandler(authenticateToken), getUser);

export default router;
