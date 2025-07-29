import { Router } from 'express';

import authRoutes from './auth';
import userRoutes from './user';
import postRoutes from './post';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/post', postRoutes);

export default router;
