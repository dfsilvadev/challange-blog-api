import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
