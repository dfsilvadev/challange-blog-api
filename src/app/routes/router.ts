import express from 'express';
import { createPost } from '../controllers/postController';
import { validaContent } from '../middlewares/validarContent';
import { validaTitle } from '../middlewares/validarTitle';
import { validaIsActive } from '../middlewares/validarIsActive';
import { validarUUID } from '../middlewares/validarUUID';

const router = express.Router();

// type User = {
//   id: number;
//   name: string;
//   age: number;
// };

// const users: User[] = [];

// router.get('/users', (req, res) => {
//   res.json(users);
// });

// router.post('/users', (req, res) => {
//   const { name, age } = req.body;
//   const user: User = { id: users.length + 1, name, age };
//   users.push(user);
//   res.status(201).json(user);
// });

router.post(
  '/posts',
  validaContent,
  validaTitle,
  validaIsActive,
  validarUUID,
  createPost
);

export default router;
