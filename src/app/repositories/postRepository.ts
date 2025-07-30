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

export const findById = async (id: string) => {
  const result = await query(
    `
      SELECT p.title, p.content, p.is_active, p.user_id, p.category_id, p.created_at, p.updated_at,
             u.id as user_id, u.name as user_name
      FROM tb_post p
      JOIN tb_user u ON p.user_id = u.id
      JOIN tb_category c ON p.category_id = c.id
      WHERE p.id = $1 AND p.is_active = true
    `,
    [id]
  );
  return result[0] || null;
};

export const deleteById = async (id: string) => {
  const [row] = await query(
    `
      DELETE FROM tb_post WHERE id = $1
    `,
    [id]
  );
  return row;
};
