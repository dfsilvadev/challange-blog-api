import express from 'express';
import { createPost } from '../controllers/postController';
import { validaContent } from '../middlewares/validarContent';
import { validaTitle } from '../middlewares/validarTitle';
import { validaIsActive } from '../middlewares/validarIsActive';
import { validarUser } from '../middlewares/validarUser';
import { validarCategory } from '../middlewares/validarCategory';

const router = express.Router();

router.post(
  '/api/posts',
  validaContent,
  validaTitle,
  validaIsActive,
  validarUser,
  validarCategory,
  createPost
);

export default router;
