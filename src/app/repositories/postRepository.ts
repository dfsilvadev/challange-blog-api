import { query } from '../../database/db';

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

export const findByFilters = async (
  categoryId?: string,
  createdAtStart?: string,
  createdAtEnd?: string,
  orderBy?: 'ASC' | 'DESC',
  page: number = 1,
  limit: number = 10,
  search?: string
) => {
  const conditions: string[] = [];
  const values: any[] = [];

  if (categoryId) {
    values.push(categoryId);
    conditions.push(`category_id = $${values.length}`);
  }

  if (createdAtStart) {
    values.push(createdAtStart);
    conditions.push(`created_at >= $${values.length}`);
  }

  if (createdAtEnd) {
    values.push(createdAtEnd);
    conditions.push(`created_at <= $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    values.push(`%${search}%`);
    conditions.push(
      `(title ILIKE $${values.length - 1} OR content ILIKE $${values.length})`
    );
  }

  const offset = (page - 1) * limit;

  values.push(limit);
  values.push(offset);

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await query(
    `SELECT * FROM tb_post
  ${whereClause}
  ORDER BY created_at ${orderBy}
  LIMIT $${values.length - 1} OFFSET $${values.length}
  `,
    values
  );
  return result;
};
