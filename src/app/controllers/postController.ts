import { Request, Response } from 'express';

import { count, findAll } from '../repositories/postRepository';

import { Pagination } from '../repositories/models/postRepositoryTypes';

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
