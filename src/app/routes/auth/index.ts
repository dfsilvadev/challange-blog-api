import { Router } from 'express';
import { login } from '../../controllers/authenticationController';

const router = Router();

router.post('/login', login);

export default router;
