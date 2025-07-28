import { createPost, updatePost } from '../../controllers/postController'; // Adicionado updatePost
import { validaContent } from '../../middlewares/Post/validarContent';
import { validaTitle } from '../../middlewares/Post/validarTitle';
import { validaIsActive } from '../../middlewares/Post/validarIsActive';
import { validarUser } from '../../middlewares/Post/validarUser';
import { validarCategory } from '../../middlewares/Post/validarCategory';
import { validateUpdatePost } from '../../middlewares/Post/validateUpdate'; // Importado o middleware de validação
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

// Nova linha para a rota de atualização (PUT)
router.put('/posts/:id', validateUpdatePost, updatePost); // Usando :id para o parâmetro do ID do post

export default router;
