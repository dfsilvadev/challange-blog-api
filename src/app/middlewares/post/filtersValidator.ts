import { NextFunction, Request, Response } from 'express';

export const validatePostFilters = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { createdAtStart, createdAtEnd, isActive, userId } = req.query;

  if (userId) {
    const isUuid =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi.test(
        userId as string
      );
    if (!isUuid) {
      return res.status(400).json({ error: true, details: 'INVALID_USER_ID' });
    }
  }

  if (createdAtStart && isNaN(new Date(createdAtStart as string).getTime())) {
    return res
      .status(400)
      .json({ error: true, details: 'INVALID_CREATED_AT_START' });
  }

  if (createdAtEnd && isNaN(new Date(createdAtEnd as string).getTime())) {
    return res
      .status(400)
      .json({ error: true, details: 'INVALID_CREATED_AT_END' });
  }

  if (isActive !== undefined) {
    if (
      typeof isActive !== 'boolean' &&
      isActive !== 'true' &&
      isActive !== 'false'
    ) {
      return res
        .status(400)
        .json({ error: true, details: 'INVALID_IS_ACTIVE' });
    }
  }

  next();
};
