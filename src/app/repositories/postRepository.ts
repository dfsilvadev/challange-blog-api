import { query } from '../../database/db';

export const getPostById = async (id: string) => {
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
