import { Request, Response, NextFunction } from 'express';
declare module 'express' {
  export interface Request {
    updateData?: {
      title?: string;
      content?: string;
      is_active?: boolean;
      category_id?: string;
    };
  }
}

export const validateUpdatePost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, content, is_active, category_id } = req.body;

  const updateData: {
    title?: string;
    content?: string;
    is_active?: boolean;
    category_id?: string;
  } = {};

  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;
  if (is_active !== undefined) updateData.is_active = is_active;
  if (category_id !== undefined) updateData.category_id = category_id;

  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ error: 'Nenhum dado fornecido para atualização.' });
  }

  req.updateData = updateData;
  next();
};
