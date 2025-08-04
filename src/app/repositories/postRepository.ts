import { query } from '../../database/db';

import {
  FindAllParams,
  FindPostResponse,
  Post,
  PostCountFilters,
  FindFilters
} from './models/postRepositoryTypes';

export const create = async (
  title: string,
  content: string,
  is_active: boolean,
  user_id: string,
  category_id: string
): Promise<Post> => {
  const [row] = await query<Post>(
    `
        INSERT INTO tb_post(title, content, is_active, user_id, category_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
    [title, content, is_active, user_id, category_id]
  );
  return row;
};

export const findById = async (id: string): Promise<FindPostResponse> => {
  const [row] = await query<FindPostResponse>(
    `
      SELECT
        tb_post.id,
        tb_post.title,
        tb_post.content,
        tb_post.is_active,
        tb_post.created_at,
        tb_post.updated_at,
        tb_post.user_id,
        tb_user.name AS "user_name",
        tb_post.category_id,
        tb_category.name AS "category_name"
      FROM
        tb_post
      INNER JOIN
        tb_user ON tb_user.id = tb_post.user_id
      INNER JOIN
        tb_category ON tb_category.id = tb_post.category_id
      WHERE
        tb_post.id = $1 AND tb_post.is_active = true
    `,
    [id]
  );
  return row;
};

export const findAll = async ({
  page,
  limit,
  orderBy,
  userId
}: FindAllParams): Promise<FindPostResponse[]> => {
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

  const rows = await query<FindPostResponse>(
    `
      SELECT
        tb_post.id,
        tb_post.title,
        tb_post.content,
        tb_post.is_active,
        tb_post.created_at,
        tb_post.updated_at,
        tb_post.user_id,
        tb_user.name AS "user_name",
        tb_post.category_id,
        tb_category.name AS "category_name"
      FROM
        tb_post
      INNER JOIN
        tb_category ON tb_category.id = tb_post.category_id
      INNER JOIN
        tb_user ON tb_user.id = tb_post.user_id
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

export const findFilter = async (
  filters: FindFilters
): Promise<FindPostResponse[]> => {
  const direction = filters.orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  const conditions = [];
  const values: (string | number | boolean)[] = [];
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
    values.push(filters.createdAtStart.toISOString());
    conditions.push(`tb_post.created_at >= $${paramIndex++}::timestamp`);
  }

  if (filters.createdAtEnd) {
    values.push(filters.createdAtEnd.toISOString());
    conditions.push(`tb_post.created_at <= $${paramIndex++}::timestamp`);
  }

  if (filters.isActive !== undefined) {
    values.push(filters.isActive);
    conditions.push(`tb_post.is_active = $${paramIndex++}::boolean`);
  } else {
    conditions.push('tb_post.is_active = true');
  }

  if (filters.search !== undefined) {
    const searchValue = `%${filters.search}%`;
    const searchCount = paramIndex++;
    values.push(searchValue);
    conditions.push(
      `(tb_post.title ILIKE $${searchCount} OR tb_post.content ILIKE $${searchCount})`
    );
  }

  values.push(filters.limit);
  const limitPlaceholder = `$${paramIndex++}`;

  values.push((filters.page - 1) * filters.limit);
  const offsetPlaceholder = `$${paramIndex++}`;

  const whereClause = conditions.length ? conditions.join(' AND ') : 'TRUE';

  const rows = await query<FindPostResponse>(
    `
    SELECT
      tb_post.id,
      tb_post.title,
      tb_post.content,
      tb_post.is_active,
      tb_post.created_at,
      tb_post.updated_at,
      tb_post.user_id,
      tb_user.name AS "user_name",
      tb_post.category_id,
      tb_category.name AS "category_name"
    FROM
      tb_post
    INNER JOIN
      tb_category ON tb_category.id = tb_post.category_id
    INNER JOIN
      tb_user ON tb_user.id = tb_post.user_id
    WHERE
      ${whereClause}
    ORDER BY
      tb_post.created_at ${direction}
    LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}
    `,
    values
  );

  return rows;
};

export const count = async (
  filters: PostCountFilters = {}
): Promise<number> => {
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

  const [{ count }] = await query<{ count: number }>(querySql, values);
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
): Promise<Post | null> => {
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

  const [row] = await query<Post>(
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
