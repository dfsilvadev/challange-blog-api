import { Router } from 'express';
import * as categoryController from '../../controllers/categoryController';

const router = Router();

/**
 * Categories routes
 * @route /post
 * @group Post - Operations about posts
 */

router.get('/', categoryController.list);

export default router;
