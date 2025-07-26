import * as postRepository from '../repositories/postRepository';
import { Request, RequestHandler, Response } from 'express';

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
