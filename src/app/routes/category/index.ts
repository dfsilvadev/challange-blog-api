import { Router } from 'express';
import * as categoryController from '../../controllers/categoryController';
import { validateUUID } from '../../middlewares/utils/validateUtils';

const router = Router();

/**
 * Categories routes
 * @route /post
 * @group Post - Operations about posts
 */

router.get('/', categoryController.list);
router.get('/exists/:id', validateUUID, categoryController.exists);

export default router;
