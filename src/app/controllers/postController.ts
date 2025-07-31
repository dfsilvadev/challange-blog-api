import { Request, RequestHandler, Response } from 'express';

import { findById as findCategoryById } from '../repositories/categoryRepository';
import {
  count,
  create,
  deleteById,
  findAll,
  findById,
  update as updatePost
} from '../repositories/postRepository';
import { findUserById } from '../repositories/userRepository';

import { Pagination } from '../repositories/models/postRepositoryTypes';

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
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
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
  } catch (err) {
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
  }
};

export const updateById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { title, content, is_active, category_id } = req.body; // Ignora user_id

  try {
    const post = await findById(id);
    if (!post) {
      return res.status(404).json({ error: true, details: 'NOT_FOUND_POST' });
    }

    if (category_id) {
      const categoryExists = await findCategoryById(category_id);
      if (!categoryExists) {
        return res
          .status(404)
          .json({ error: true, details: 'NOT_FOUND_CATEGORY' });
      }
    }

    const updateFields: any = {};
    if (title !== undefined) updateFields.title = title;
    if (content !== undefined) updateFields.content = content;
    if (is_active !== undefined) updateFields.is_active = is_active;
    if (category_id !== undefined) updateFields.category_id = category_id;

    const updated = await updatePost(id, updateFields);
    res.status(200).json({ status: 'OK', details: updated });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
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
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
  }
};

const getPostsWithPagination = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { page = 1, limit = 10, orderBy = 'ASC' } = req.query;

  const currentPage = Number(page);
  const currentLimit = Number(limit);

  const validOrder =
    typeof orderBy === 'string' && (orderBy === 'ASC' || orderBy === 'DESC')
      ? orderBy
      : 'ASC';

  const [posts, total] = await Promise.all([
    findAll({
      page: currentPage,
      limit: currentLimit,
      orderBy: validOrder,
      userId
    }),
    count({ userId })
  ]);

  const totalPages = Math.ceil(total / currentLimit);
  const registersPerPage = currentLimit;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const nextPage = hasNextPage ? currentPage + 1 : 0;
  const previousPage = hasPreviousPage ? currentPage - 1 : 0;
  const firstPage = currentPage > 1 ? 1 : 0;
  const lastPage = currentPage < totalPages ? totalPages : 0;

  const pagination: Pagination = {
    total,
    totalPages,
    registersPerPage,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage
  };

  res.status(200).json({
    status: 'Ok',
    details: posts,
    pagination
  });
};

export const list = getPostsWithPagination;
export const listByUserId = getPostsWithPagination;
