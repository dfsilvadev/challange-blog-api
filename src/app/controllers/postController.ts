import { Request, RequestHandler, Response } from 'express';

import * as categoryRepository from '../repositories/categoryRepository';
import * as postRepository from '../repositories/postRepository';
import * as userRepository from '../repositories/userRepository';

import { getPagination } from '../../utils/pagination/pagination';

import {
  parseDate,
  parseBoolean,
  parseNumber,
  parseOrder
} from '../../utils/parses/parsers';

export const create: RequestHandler = async (req: Request, res: Response) => {
  const { title, content, is_active, user_id, category_id } = req.body;

  try {
    const user = await userRepository.findById(user_id);
    if (!user) {
      res.status(404).json({ error: true, details: 'NOT_FOUND_USER' });
      return;
    }
    const category = await categoryRepository.findById(category_id);
    if (!category) {
      res.status(404).json({ error: true, details: 'NOT_FOUND_CATEGORY' });
      return;
    }

    const post = await postRepository.create(
      title,
      content,
      is_active,
      user_id,
      category_id
    );
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
    const post = await postRepository.findById(id);
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
  const { title, content, is_active, category_id } = req.body;

  try {
    const post = await postRepository.findById(id);
    if (!post) {
      return res.status(404).json({ error: true, details: 'NOT_FOUND_POST' });
    }

    if (category_id) {
      const categoryExists = await categoryRepository.findById(category_id);
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

    const updated = await postRepository.update(id, updateFields);
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
  // @ts-ignore: user populado pelo middleware de autenticação
  const loggedUserId = req.user?.id;

  try {
    const post = await postRepository.findById(id);
    if (!post) {
      return res.status(404).json({ error: true, details: 'NOT_FOUND_POST' });
    }
    if (!loggedUserId) {
      return res.status(401).json({ error: true, details: 'UNAUTHORIZED' });
    }

    if (post.user_id !== loggedUserId) {
      return res.status(403).json({
        error: true,
        details: 'FORBIDDEN: Only the post creator can delete this post'
      });
    }
    await postRepository.deleteOne(id);
    res.status(200).json({ status: 'OK', details: 'POST_DELETED' });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
  }
};

const getPostsWithPagination = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, orderBy = 'ASC' } = req.query;

    const currentPage = Number(page);
    const currentLimit = Number(limit);

    const validOrder =
      typeof orderBy === 'string' && (orderBy === 'ASC' || orderBy === 'DESC')
        ? orderBy
        : 'ASC';

    const [posts, total] = await Promise.all([
      postRepository.findAll({
        page: currentPage,
        limit: currentLimit,
        orderBy: validOrder,
        userId
      }),
      postRepository.count({ userId })
    ]);
    const pagination = getPagination(total, currentPage, currentLimit);

    res.status(200).json({
      status: 'Ok',
      details: posts,
      pagination
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
  }
};

const getPostsFilterWithPagination = async (req: Request, res: Response) => {
  try {
    const filters = getFilters(req.query);

    const [posts] = await Promise.all([
      postRepository.findFilter({
        page: filters.page,
        limit: filters.limit,
        orderBy: filters.orderBy,
        categoryId: filters.categoryId,
        createdAtStart: filters.createdAtStart,
        createdAtEnd: filters.createdAtEnd,
        isActive: filters.isActive,
        userId: filters.userId
      })
    ]);
    const pagination = getPagination(posts.length, filters.page, filters.limit);

    res.status(200).json({
      status: 'Ok',
      details: posts,
      pagination
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: true, details: err instanceof Error ? err.message : err });
  }
};

function getFilters(query: any) {
  return {
    createdAtStart: parseDate(query.createdAtStart),
    createdAtEnd: parseDate(query.createdAtEnd),
    isActive: parseBoolean(query.isActive, true),
    userId: typeof query.userId === 'string' ? query.userId : undefined,
    categoryId:
      typeof query.categoryId === 'string' ? query.categoryId : undefined,
    orderBy: parseOrder(query.orderBy),
    page: parseNumber(query.page, 1),
    limit: parseNumber(query.limit, 10)
  };
}

export const list = getPostsWithPagination;
export const listByUserId = getPostsWithPagination;
export const listFilter = getPostsFilterWithPagination;
