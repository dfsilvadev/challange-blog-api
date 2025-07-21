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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating post:', error); // Adicionado log para depuração
    res.status(500).json({ error: 'Erro na criação do post.' });
  }
};

export const updatePost: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { title, content, is_active, category_id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID da postagem é obrigatório.' });
  }

  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ error: 'Nenhum dado fornecido para atualização.' });
  }

  try {
    const updatedPost = await postRepository.updatePost(
      id,
      title,
      content,
      is_active,
      category_id
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Postagem não encontrada.' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating post:', error); // Adicionado log para depuração
    res.status(500).json({ error: 'Erro na atualização do post.' });
  }
};
