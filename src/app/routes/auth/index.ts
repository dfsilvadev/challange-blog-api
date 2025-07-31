import { Router } from 'express';

import * as authenticationController from '../../controllers/authenticationController';

const router = Router();

router.post('/login', authenticationController.login);

export default router;
