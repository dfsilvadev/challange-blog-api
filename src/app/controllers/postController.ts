import * as postRepository from '../repositories/postRepository';
import { Request, RequestHandler, Response } from 'express';

export const createPost: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { title, content, is_active, user_id, category_id } = req.body;

  if (!title || !content) {
    res.status(400).json('todos os campos precisam estar preenchidos');
    return;
  }

  try {
    const post = await postRepository.create(
      title,
      content,
      is_active ?? true,
      user_id,
      category_id
    );
    res.status(201).json(post);
  } catch {
    res.status(500).json({ error: 'Erro na criação do post.' });
  }
};
