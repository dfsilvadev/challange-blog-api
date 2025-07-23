import { Router } from 'express';
import express from 'express';

import { validarUUID } from '../middlewares/validarUUID';
import { getPostById } from '../controllers/postController';

import authRoutes from './auth';
import userRoutes from './user';

const router = Router();

router.get('/posts/:id', validarUUID, getPostById);

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
