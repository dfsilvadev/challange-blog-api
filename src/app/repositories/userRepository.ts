import { query } from '../../database/db';

import {
  CreateUserParams,
  FindAllUsersParams,
  UserEntity,
  UserPassword,
  UserWithPasswordHash
} from './models/postRepositoryTypes';

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
    `SELECT id, email, name, phone, password_hash
     FROM tb_user
     WHERE email = $1 OR name = $1
     LIMIT 1;`,
    [emailOrName]
  );

  return row;
};

export const findAll = async ({
  page,
  limit,
  orderBy
}: FindAllUsersParams): Promise<UserEntity[]> => {
  const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  const offset = (page - 1) * limit;

  const values: (string | number)[] = [limit, offset];

  const rows = await query<UserEntity>(
    `
      SELECT
        tb_user.id,
        tb_user.name,
        tb_user.email,
        tb_user.phone,
        tb_user.created_at,
        tb_user.updated_at,
        tb_user.role_id
      FROM
        tb_role
      INNER JOIN
        tb_role ON tb_role.id = tb_user.role_id
      ORDER BY
        tb_user.created_at ${direction}
      LIMIT $1 OFFSET $2
    `,
    values
  );

  return rows;
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
