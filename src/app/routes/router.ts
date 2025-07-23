import express from 'express';
import { validarUUID } from '../middlewares/validarUUID';
import { getPostById } from '../controllers/postController';

const router = express.Router();

router.get('/posts/:id', validarUUID, getPostById);

export default router;
