import { Request, RequestHandler, Response } from 'express';
import {
  deleteById,
  findByFilters,
  findById
} from '../repositories/postRepository';

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
      res.status(404).json({ error: true, details: 'NOT_FOUND_POST' });
    } else {
      const post = await deleteById(id);

      res.status(200).json({ status: 'OK', details: { post } });
    }
  } catch (err) {
    res.status(500).json({ error: true, details: err });
  }
};

export const getByFilter: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      categoryId,
      createdAtStart,
      createdAtEnd,
      orderBy = 'DESC',
      page = '1',
      limit = '10',
      search
    } = req.query;

    const numPage = parseInt(page as string, 10);
    const numLimit = parseInt(limit as string, 10);

    if (!numLimit || !numPage) {
      return res
        .status(400)
        .json({ error: true, detail: 'Necessário informar limit e page' });
    }

    const posts = await findByFilters(
      categoryId?.toString(),
      createdAtStart?.toString(),
      createdAtEnd?.toString(),
      orderBy === 'ASC' ? 'ASC' : 'DESC',
      parseInt(page as string, 10) || 1,
      parseInt(limit as string, 10) || 1,
      search?.toString()
    );

    res.status(200).json({ status: 'Ok', detail: posts, pagination: page });
  } catch (e) {
    res.status(500).json({ error: true, detail: e });
  }
};
