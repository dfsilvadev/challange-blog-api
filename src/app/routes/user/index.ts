// (Seu arquivo de rotas, ex: userRoutes.ts)
import express from 'express';
import { createUser, getUser } from '../../controllers/userController';
import {
  userValidationRules,
  validate
} from '../../middlewares/user/userMiddleware';
import { authenticateToken } from '../../middlewares/auth/authenticationMiddleware';
import { asyncHandler } from '../../../utils/asyncHandler'; // Importe o wrapper

const router = express.Router();

router.post('/', userValidationRules, validate, createUser);

// Use asyncHandler para envolver authenticateToken
router.get('/:id', asyncHandler(authenticateToken), getUser);

export default router;
