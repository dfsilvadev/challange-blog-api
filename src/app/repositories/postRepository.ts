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

export const findCategoryById = async (
  category_id: string
): Promise<boolean> => {
  const result = await query<{ exists: boolean }>(
    `
    SELECT EXISTS (
      SELECT 1 FROM tb_category WHERE id = $1
    ) AS "exists"
    `,
    [category_id]
  );

  return !!result[0]?.exists;
};
