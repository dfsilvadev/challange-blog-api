import { createPost } from '../../controllers/postController';
import { validaContent } from '../../middlewares/Post/validarContent';
import { validaTitle } from '../../middlewares/Post/validarTitle';
import { validaIsActive } from '../../middlewares/Post/validarIsActive';
import { validarUser } from '../../middlewares/Post/validarUser';
import { validarCategory } from '../../middlewares/Post/validarCategory';
import { Router } from 'express';

const router = Router();

router.post(
  '/post',
  validaContent,
  validaTitle,
  validaIsActive,
  validarUser,
  validarCategory,
  createPost
);

export default router;
