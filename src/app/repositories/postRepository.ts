import { query } from '../../database/db';

import { FindAllParams, PostCountFilters } from './models/postRepositoryTypes';

export const create = async (
  title: string,
  content: string,
  is_active: boolean,
  user_id: string,
  category_id: string
) => {
  const [row] = await query(
    `
        INSERT INTO tb_post(title, content, is_active, user_id, category_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
    [title, content, is_active, user_id, category_id]
  );
  return [row];
};

export const findById = async (id: string) => {
  // TODO: add user name and user id
  const row = await query(
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
  return row || null;
};

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
  } else {
    conditions.push('tb_post.is_active = TRUE');
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

export const update = async (
  id: string,
  fields: Partial<{
    title: string;
    content: string;
    is_active: boolean;
    user_id: string;
    category_id: string;
  }>
) => {
  const allowedFields = [
    'title',
    'content',
    'is_active',
    'user_id',
    'category_id'
  ];
  const setClauses = [];
  const values = [];
  let idx = 1;

  for (const key of allowedFields) {
    if (fields[key as keyof typeof fields] !== undefined) {
      setClauses.push(`${key} = $${idx}`);
      values.push(fields[key as keyof typeof fields]);
      idx++;
    }
  }

  if (setClauses.length === 0) {
    throw new Error('Nenhum campo fornecido para atualização');
  }

  values.push(id);

  const [row] = await query(
    `UPDATE tb_post SET ${setClauses.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return row;
};

export const deleteOne = async (id: string) => {
  const row = await query(
    `
      DELETE FROM tb_post WHERE id = $1
    `,
    [id]
  );
  return row;
};
