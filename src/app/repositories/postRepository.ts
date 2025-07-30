import { query } from '../../database/db';

import { FindAllParams, PostCountFilters } from './models/postRepositoryTypes';

export const findAll = async ({
  page,
  limit,
  orderBy,
  userId
}: FindAllParams) => {
  const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  const offset = (page - 1) * limit;

  const conditions = ['tb_post.is_active = TRUE'];
  const values: (string | number)[] = [limit, offset];
  let paramIndex = 3;

  if (userId) {
    conditions.push(`tb_post.user_id = $${paramIndex}::uuid`);
    values.push(userId);
    paramIndex++;
  }

  const whereClause = conditions.join(' AND ');

  const rows = await query(
    `
      SELECT
        tb_post.id,
        tb_post.title,
        tb_post.content,
        tb_post.is_active,
        tb_post.created_at,
        tb_post.updated_at,
        tb_post.user_id,
        tb_post.category_id,
        tb_category.id AS "categoryId",
        tb_category.name AS "categoryName"
      FROM
        tb_post
      INNER JOIN
        tb_category ON tb_category.id = tb_post.category_id
      WHERE
        ${whereClause}
      ORDER BY
        tb_post.created_at ${direction}
      LIMIT $1 OFFSET $2
    `,
    values
  );

  return rows;
};

export const count = async (filters: PostCountFilters = {}) => {
  const conditions: string[] = ['tb_post.is_active = TRUE'];
  const values: (string | Date | boolean)[] = [];
  let paramIndex = 1;

  if (filters.userId) {
    values.push(filters.userId);
    conditions.push(`tb_post.user_id = $${paramIndex++}::uuid`);
  }

  if (filters.categoryId) {
    values.push(filters.categoryId);
    conditions.push(`tb_post.category_id = $${paramIndex++}::uuid`);
  }

  if (filters.createdAtStart) {
    values.push(filters.createdAtStart);
    conditions.push(`tb_post.created_at >= $${paramIndex++}::timestamp`);
  }

  if (filters.createdAtEnd) {
    values.push(filters.createdAtEnd);
    conditions.push(`tb_post.created_at <= $${paramIndex++}::timestamp`);
  }

  if (filters.isActive !== undefined) {
    values.push(filters.isActive);
    conditions.push(`tb_post.is_active = $${paramIndex++}::boolean`);
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  const querySql = `
    SELECT COUNT(*)::integer AS count
    FROM tb_post
    ${whereClause}
  `;

  const [{ count }] = await query(querySql, values);
  return count;
};
