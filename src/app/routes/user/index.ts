import express from 'express';
import { createUser } from '../../controllers/userController';
import {
  userValidationRules,
  validate
} from '../../middlewares/user/userMiddleware';

const router = express.Router();

router.post('/', userValidationRules, validate, createUser);

export default router;
