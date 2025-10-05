import { Request, Response } from 'express';
import * as commentRepository from '../repositories/commentRepository';
import * as postRepository from '../repositories/postRepository';

export const create = async (req: Request, res: Response) => {
  const post_id = req.params.postId;
  const { content, author } = req.body;

  try {
    const post = await postRepository.findById(post_id);
    if (!post) {
      return res.status(404).json({ error: true, details: 'NOT_FOUND_POST' });
    }

    const comment = await commentRepository.create({
      content,
      author,
      post_id
    });

    res.status(201).json({ status: 'OK', details: comment });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
  }
};

export const list = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const post = await postRepository.findById(postId);
    if (!post) {
      return res.status(404).json({ error: true, details: 'NOT_FOUND_POST' });
    }

    const comments = await commentRepository.findAllByPostId(postId);

    res.status(200).json({ status: 'OK', details: comments });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
  }
};
