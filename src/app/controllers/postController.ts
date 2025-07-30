import { Request, RequestHandler, Response } from 'express';

import { deleteById, findById } from '../repositories/postRepository';

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
