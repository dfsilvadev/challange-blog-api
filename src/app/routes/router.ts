import { Router } from 'express';

import authRoutes from './auth';
import postRoutes from './post';
import userRoutes from './user';

const router = Router();

/* * Define routes for the application
 * Each route is imported from its respective file and added to the main router.
 */
/* Authentication routes */
router.use('/auth', authRoutes);
router.use('/user', userRoutes);

/* Post routes */
router.use('/post', postRoutes);

/* Health check endpoint */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'blog-api'
  });
});

export default router;
