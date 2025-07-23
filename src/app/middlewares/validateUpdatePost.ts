import { Request, Response, NextFunction } from 'express';

// Adiciona uma tipagem para o objeto Request do Express
// para incluir a propriedade 'updateData' que será adicionada pelo middleware
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

  // Constrói um objeto 'updateData' contendo apenas os campos que foram fornecidos
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

  // Se nenhum dado válido foi fornecido para atualização, retorna um erro 400
  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ error: 'Nenhum dado fornecido para atualização.' });
  }

  // Anexa o objeto updateData à requisição para que o controlador possa acessá-lo
  req.updateData = updateData;
  next(); // Passa o controle para o próximo middleware ou para o controlador
};
