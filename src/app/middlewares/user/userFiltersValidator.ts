import { NextFunction, Request, Response } from 'express';

export const validateUserFilters = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { roleName, email, name } = req.query;

  if (roleName) {
    if (roleName != 'teacher' && roleName != 'student') {
      return res
        .status(400)
        .json({ error: true, details: 'INVALID_ROLE_NAME' });
    }
  }

  if (email) {
    const isEmail = typeof email === 'string' && email.includes('@');
    if (!isEmail) {
      return res
        .status(400)
        .json({ error: true, details: 'INVALID_EMAIL_ADDRESS' });
    }
  }

  if (name) {
    const doesNotContainNumbers = /^[a-zA-Z\s]+$/.test(name as string);
    if (!doesNotContainNumbers) {
      return res.status(400).json({ error: true, details: 'INVALID_NAME' });
    }
  }

  next();
};
