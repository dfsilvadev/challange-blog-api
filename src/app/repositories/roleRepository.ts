import { query } from '../../database/db';

import { Role } from './models/postRepositoryTypes';

export const findIdByName = async (name: string): Promise<string> => {
  const [row] = await query<Role>(
    `SELECT id
     FROM tb_role
     WHERE "name" = $1
     LIMIT 1;`,
    [name]
  );

  return row.id || '';
};

export const findById = async (id: string): Promise<Role | null> => {
  const [row] = await query<Role>(
    `SELECT id, "name"
     FROM tb_role
     WHERE id = $1
     LIMIT 1;`,
    [id]
  );

  return row || null;
};

export const findUserByRoleId = async (
  roleId: string,
  userId: string
): Promise<Role | null> => {
  const [row] = await query<Role>(
    `SELECT r.id, r."name"
     FROM tb_role as r
     INNER JOIN tb_user as u ON r.id = u.role_id
     WHERE r.id = $1 and u.Id = $2
     LIMIT 1;`,
    [roleId, userId]
  );

  return row || null;
};
