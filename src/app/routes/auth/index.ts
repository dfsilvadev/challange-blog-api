import { Router } from 'express';

import * as authenticationController from '../../controllers/authenticationController';

const router = Router();

/**
 * Authentication routes
 * @route /auth
 * @group Auth - Operations about authentication
 */
router.post('/login', authenticationController.login);

export default router;
