import { query } from '../../database/db';

import {
  CreateUserParams,
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
