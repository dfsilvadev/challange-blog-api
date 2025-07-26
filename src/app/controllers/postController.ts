import { Request, RequestHandler, Response } from 'express';
import { deleteById, findById } from '../repositories/postRepository';

export const removeById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;

  try {
    const validate = await findById(id);

    if (!validate) {
      res.status(404).json({ error: true, details: 'NOT_FOUND_POST' });
    } else {
      const post = await deleteById(id);

      res.status(200).json({ status: 'OK', details: { post } });
    }
  } catch (err) {
    res.status(500).json({ error: true, details: err });
  }
};
