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
