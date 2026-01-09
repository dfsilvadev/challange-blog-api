import { query } from '../../database/db';

import {
  CreateUserParams,
  UpdateUserParams,
  UserEntity,
  UserPassword,
  UserWithPasswordHash,
  FindAllParams
} from './models/postRepositoryTypes';

export const findById = async (id: string): Promise<UserEntity> => {
  const [row] = await query<UserEntity>(
    `SELECT id, email, name, phone, role_id as "roleid"
     FROM tb_user
     WHERE id = $1
     LIMIT 1;`,
    [id]
  );

  return row;
};

export const findByEmailOrName = async (
  emailOrName: string
): Promise<UserWithPasswordHash> => {
  const [row] = await query<UserWithPasswordHash>(
    `SELECT u.id, u.email, u.name, u.phone, u.password_hash, u.role_id, r.name AS "roleName" 
     FROM
        tb_user as u
      INNER JOIN
        tb_role as r ON r.id = u.role_id
     WHERE u.email = $1 OR u.name = $1
     LIMIT 1;`,
    [emailOrName]
  );

  return row;
};

export const findAll = async ({
  page,
  limit,
  orderBy
}: FindAllParams): Promise<UserEntity[]> => {
  const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  const offset = (page - 1) * limit;

  const values: (string | number)[] = [limit, offset];

  const rows = await query<UserEntity>(
    `
      SELECT
        u.id,
        u.name,
        u.email,
        u.phone,
        u.role_id,
        r.name AS "role_name",
        u.created_at,
        u.updated_at
      FROM
        tb_user as u
      INNER JOIN
        tb_role as r ON r.id = u.role_id
      ORDER BY
        u.created_at ${direction}
      LIMIT $1 OFFSET $2
    `,
    values
  );

  return rows;
};

export const count = async (): Promise<number> => {
  const values: (string | Date | boolean)[] = [];

  const querySql = `
    SELECT COUNT(*)::integer AS count
    FROM tb_user
  `;

  const [{ count }] = await query<{ count: number }>(querySql, values);
  return count;
};

export const create = async ({
  name,
  email,
  phone,
  passwordHash,
  roleId
}: CreateUserParams): Promise<UserWithPasswordHash> => {
  const [row] = await query<UserWithPasswordHash>(
    `
     INSERT INTO public.tb_user
      (id, "name", email, phone, password_hash, role_id)
      VALUES(uuid_generate_v4(),$1, $2, $3, $4, $5);
      `,
    [name, email, phone, passwordHash, roleId]
  );
  return row;
};

export const alter = async ({ id, name, email, phone, roleId }: UserEntity) => {
  const [row] = await query(
    `
     UPDATE public.tb_user
      SET "name" = $2, email = $3, phone = $4, role_id = $5
      WHERE id = $1
      `,
    [id, name, email, phone, roleId]
  );
  return row;
};

export const alterPassword = async ({ id, passwordHash }: UserPassword) => {
  const [row] = await query(
    `
     UPDATE public.tb_user
      SET password_hash = $2
      WHERE id = $1
      `,
    [id, passwordHash]
  );
  return row;
};

export const update = async (
  id: string,
  fields: Partial<{
    name: string;
    email: string;
    phone: string;
    roleId: string;
  }>
): Promise<UpdateUserParams | null> => {
  const columnMapping: Record<string, string> = {
    name: 'name',
    email: 'email',
    phone: 'phone',
    roleId: 'role_id'
  };

  const setClauses = [];
  const values = [];
  let idx = 1;

  for (const [tsKey, sqlColumn] of Object.entries(columnMapping)) {
    const value = fields[tsKey as keyof typeof fields];

    if (value !== undefined) {
      setClauses.push(`${sqlColumn} = $${idx}`);
      values.push(value);
      idx++;
    }
  }

  if (setClauses.length === 0) {
    throw new Error('Nenhum campo fornecido para atualização');
  }

  values.push(id);

  const [row] = await query<UpdateUserParams>(
    `UPDATE tb_user SET ${setClauses.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );

  return row;
};

export const deleteOne = async (id: string) => {
  const row = await query(
    `
      DELETE FROM tb_user WHERE id = $1
    `,
    [id]
  );
  return row;
};
