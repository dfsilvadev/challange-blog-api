import { Request, Response, NextFunction } from 'express';
import { isUUID } from 'validator';

export const validateUUID = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;

  if (!isUUID(id)) {
    res.status(400).json({ error: true, details: 'INVALID_UUID' });
  }

  next();
};

export const validateFilterQuery = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { orderBy, page, limit, createdAtStart, createdAtEnd } = req.query;

  if (orderBy && orderBy !== 'ASC' && orderBy !== 'DESC') {
    res.status(400).json({ message: 'orderBy deve ser ASC ou DESC' });
  }

  if (page && isNaN(Number(page))) {
    res.status(400).json({ message: 'page deve ser um número' });
  }

  if (limit && isNaN(Number(limit))) {
    res.status(400).json({ message: 'limit deve ser um número' });
  }

  if (createdAtStart && isNaN(Date.parse(createdAtStart as string))) {
    res
      .status(400)
      .json({ message: 'createdAtStart deve ser uma data válida' });
  }

  if (createdAtEnd && isNaN(Date.parse(createdAtEnd as string))) {
    res.status(400).json({ message: 'createdAtEnd deve ser uma data válida' });
  }

  next();
};
