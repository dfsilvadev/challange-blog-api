import express from 'express';
import { createPost, updatePost } from '../../controllers/postController';
import { validateUpdatePost } from '../../middlewares/validateUpdatePost'; // Importe o novo middleware

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

router.post('/posts', createPost);
// Aplica o middleware validateUpdatePost antes do controlador updatePost
router.put('/posts/:id', validateUpdatePost, updatePost);

export default router;
