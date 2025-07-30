import { Router } from 'express';

import authRoutes from './auth';
import postRoutes from './post';
import userRoutes from './user';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);

export default router;
