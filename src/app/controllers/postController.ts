import * as postRepository from '../repositories/postRepository';
import { Request, RequestHandler, Response } from 'express';

// Esta declaração de módulo é crucial para que o TypeScript reconheça 'req.updateData'
declare module 'express' {
  export interface Request {
    updateData?: {
      title?: string;
      content?: string;
      is_active?: boolean;
      category_id?: string;
    };
  }
}

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
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Erro na criação do post.' });
  }
};

export const updatePost: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  // O updateData agora vem da requisição, que foi populada pelo middleware
  const updateData = req.updateData; // <-- Acessa o objeto preparado pelo middleware

  if (!id) {
    return res.status(400).json({ error: 'ID da postagem é obrigatório.' });
  }

  // A validação de 'nenhum dado fornecido para atualização' foi movida para o middleware

  try {
    // A chamada agora passa apenas o ID e o objeto updateData!
    const updatedPost = await postRepository.updatePost(
      id,
      updateData! // Usando asserção de não-nulo '!'
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Postagem não encontrada.' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Erro na atualização do post.' });
  }
};
