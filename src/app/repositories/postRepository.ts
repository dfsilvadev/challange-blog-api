import { query } from '../../database/db';

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
  title?: string,
  content?: string,
  is_active?: boolean,
  category_id?: string
) => {
  const fields: string[] = [];
  const values: (string | boolean)[] = [id];
  let paramIndex = 2;

  if (title !== undefined) {
    fields.push(`title = $${paramIndex}`);
    values.push(title);
    paramIndex++;
  }
  if (content !== undefined) {
    fields.push(`content = $${paramIndex}`);
    values.push(content);
    paramIndex++;
  }
  if (is_active !== undefined) {
    fields.push(`is_active = $${paramIndex}`);
    values.push(is_active);
    paramIndex++;
  }
  if (category_id !== undefined) {
    fields.push(`category_id = $${paramIndex}`);
    values.push(category_id);
    paramIndex++;
  }

  if (fields.length === 0) {
    return null; // Nenhum campo para atualizar
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
