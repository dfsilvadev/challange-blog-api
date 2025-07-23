import { query } from '../../database/db';
interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
  password_hash: string;
  roleId: string;
}

interface UserPassword {
  id: string;
  password_hash: string;
}

interface UserFound {
  id: string;
  email: string;
  name: string;
  phone: string;
  password_hash: string;
}

interface UserEntity {
  id: string;
  email: string;
  name: string;
  phone: string;
  roleid: string;
}

export const findUserById = async (id: string): Promise<UserEntity | null> => {
  const result = await query(
    `SELECT id, email, name, phone, role_id as "roleid"
     FROM tb_user  
     WHERE id = $1 
     LIMIT 1;`,
    [id]
  );

  const row = result[0];
  return row ? (row as UserEntity) : null;
};

export const findUserByEmailOrName = async (
  emailOrName: string
): Promise<UserFound | null> => {
  const result = await query(
    `SELECT id, email, name, phone, password_hash  
     FROM tb_user  
     WHERE email = $1 OR name = $1  
     LIMIT 1;`,
    [emailOrName]
  );

  const row = result[0];
  return row ? (row as UserFound) : null;
};

export const alter = async ({ id, name, email, phone, roleid }: UserEntity) => {
  const [row] = await query(
    `  
     UPDATE public.tb_user  
      SET "name" = $2, email = $3, phone = $4, role_id = $5
      WHERE id = $1 
      `,
    [id, name, email, phone, roleid]
  );
  return row;
};

export const alterPassword = async ({ id, password_hash }: UserPassword) => {
  const [row] = await query(
    `  
     UPDATE public.tb_user  
      SET password_hash = $2
      WHERE id = $1 
      `,
    [id, password_hash]
  );
  return row;
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
