import { Router } from 'express';
import postsRoutes from './post';
import authRoutes from './auth';
import userRoutes from './user';

const router = Router();

router.use('/post', postsRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
