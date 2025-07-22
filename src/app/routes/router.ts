import express from 'express';
import { Router } from 'express';

import { createPost } from '../controllers/postController';

import { validaContent } from '../middlewares/validarContent';
import { validaTitle } from '../middlewares/validarTitle';
import { validaIsActive } from '../middlewares/validarIsActive';
import { validarUUID } from '../middlewares/validarUUID';

import authRoutes from './auth';
import userRoutes from './user';

const router = Router();

router.post(
  '/posts',
  validaContent,
  validaTitle,
  validaIsActive,
  validarUUID,
  createPost
);

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
