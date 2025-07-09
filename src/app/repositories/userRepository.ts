import { query } from '../../database/db';

export const findUserByEmailOrName = async (emailOrName: string) => {
  const result = await query(
    `SELECT id, email, name, password_hash
    FROM tb_user
    WHERE email = $1 OR name = $1
    LIMIT 1;`,
    [emailOrName]
  );
  return result[0] || null;
};

export const create = async (
  name: string,
  email: string,
  phone: string,
  password_hash: string,
  roleId: string
) => {
  const result = await query(
    `
       INSERT INTO public.tb_user
        (id, "name", email, phone, password_hash, role_id, created_at, updated_at)
        VALUES(uuid_generate_v4(), $1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `,
    [name, email, phone, password_hash, roleId]
  );
  return result[0];
};
