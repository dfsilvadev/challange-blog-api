import * as postRepository from '../repositories/postRepository';
import { Request, RequestHandler, Response } from 'express';

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

  const post = await postRepository.create(
    title,
    content,
    is_active,
    user_id,
    category_id
  );
  res.status(201).json({ status: 'ok', details: post });
};

export const updatePost: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const updateData = req.updateData;

  try {
    const updatedPost = await postRepository.updatePost(
      id,
      updateData!
    );

    if (updatedPost) {
      res.status(200).json({ message: 'Post atualizado com sucesso!', post: updatedPost });
    } else {
      res.status(404).json({ message: 'Post não encontrado.' });
    }
  } catch (_error: any) { // 'error' tipado como 'any' e prefixado com '_', e uso de 'void'
    void _error; // Explicitamente marca _error como "usado" para o linter
    res.status(500).json({ message: 'Erro ao atualizar o post.' });
  }
};
