import { Router } from 'express';

import authRoutes from './auth';
import postRoutes from './post';
import userRoutes from './user';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'blog-api'
  });
});

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/post', postRoutes);

export default router;
