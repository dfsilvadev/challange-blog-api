import * as postRepository from '../repositories/postRepository';
import { Request, RequestHandler, Response } from 'express';

export const getPostById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const post = await postRepository.getPostById(id);
    if (!post) {
      res.status(404).json({ error: true, details: 'POST_NOT_FOUND' });
      return;
    }
    res.status(200).json({ status: 'Ok', details: post });
  } catch {
    res.status(404).json({ error: true, details: 'POST_NOT_FOUND' });
  }
};
