import { query } from '../../database/db';

interface UpdatePostData {
  title?: string;
  content?: string;
  is_active?: boolean;
  category_id?: string;
}

export const create = async (
  title: string,
  content: string,
  is_active: boolean,
  user_id: string,
  category_id: string
) => {
  const result = await query(
    `
        INSERT INTO tb_post(title, content, is_active, user_id, category_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
    [title, content, is_active, user_id, category_id]
  );
  return result[0];
};

export const updatePost = async (
  id: string,
  data: UpdatePostData // Agora recebe um objeto com os dados a serem atualizados
) => {
  const fields: string[] = [];
  const values: (string | boolean | undefined)[] = [id]; // Adicionado 'undefined' ao tipo dos valores para maior flexibilidade

  let paramIndex = 2; // Começa em 2 porque $1 é o ID

  // Itera sobre as chaves do objeto 'data' para construir a query dinamicamente
  for (const key in data) {
    // Adicionamos a asserção 'as keyof UpdatePostData' aqui
    if (
      Object.prototype.hasOwnProperty.call(data, key) &&
      data[key as keyof UpdatePostData] !== undefined
    ) {
      fields.push(`${key} = $${paramIndex}`);
      values.push(data[key as keyof UpdatePostData]); // E aqui também
      paramIndex++;
    }
  }

  // Se nenhum campo válido foi fornecido no objeto 'data', retorna null (safeguard)
  if (fields.length === 0) {
    return null;
  }

  const setClause = fields.join(', ');

  const result = await query(
    `
    UPDATE tb_post
    SET ${setClause}
    WHERE id = $1
    RETURNING *
    `,
    values
  );
  return result[0] || null;
};
