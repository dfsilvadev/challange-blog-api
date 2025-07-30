import { Router } from 'express';

import { list } from '../../controllers/postController';

const router = Router();

router.get('/', list);

export default router;
