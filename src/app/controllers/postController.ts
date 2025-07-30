import { Request, RequestHandler, Response } from 'express';

import { create, deleteById, findById } from '../repositories/postRepository';
import { findUserById } from '../repositories/userRepository';

export const created: RequestHandler = async (req: Request, res: Response) => {
  const { title, content, is_active, user_id, category_id } = req.body;

  try {
    const user = await findUserById(user_id);
    if (!user) {
      res.status(404).json({ error: true, details: 'NOT_FOUND_USER' });
      return;
    }
    const category = await findById(category_id);
    if (!category) {
      res.status(404).json({ error: true, details: 'NOT_FOUND_CATEGORY' });
      return;
    }

    const post = await create(title, content, is_active, user_id, category_id);
    res.status(201).json({ status: 'OK', details: post });
  } catch (err) {
    res.status(500).json({ error: true, details: err });
  }
};

export const getById: RequestHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await findById(id);
    if (!post) {
      res.status(404).json({ error: true, details: 'NOT_FOUND_POST' });
      return;
    }
    res.status(200).json({ status: 'Ok', details: post });
  } catch {
    res.status(404).json({ error: true, details: 'NOT_FOUND_POST' });
  }
};

export const removeById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;

  try {
    const validate = await findById(id);

    if (!validate) {
      return res.status(404).json({ error: true, details: 'NOT_FOUND_POST' });
    }

    await deleteById(id);
    res.status(200).json({ status: 'OK', details: 'POST_DELETED' });
  } catch (err) {
    res.status(500).json({ error: true, details: err });
  }
};
