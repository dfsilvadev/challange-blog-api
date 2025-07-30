import { query } from '../../database/db';

export const findById = async (id: string) => {
  const [row] = await query(
    `
      SELECT title, content, is_active, user_id, category_id, created_at, updated_at
      FROM tb_post
      WHERE id = $1
    `,
    [id]
  );
  return row || null;
};

export const deleteById = async (id: string) => {
  const row = await query(
    `
      DELETE FROM tb_post WHERE id = $1
    `,
    [id]
  );
  return row;
};
