import { query } from '../../database/db';
interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
  password_hash: string;
  roleId: string;
}

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

export const create = async ({
  name,
  email,
  phone,
  password_hash,
  roleId
}: CreateUserParams) => {
  const [row] = await query(
    `  
     INSERT INTO public.tb_user  
      (id, "name", email, phone, password_hash, role_id)  
      VALUES(uuid_generate_v4(),$1, $2, $3, $4, $5);  
      `,
    [name, email, phone, password_hash, roleId]
  );
  return row;
};
