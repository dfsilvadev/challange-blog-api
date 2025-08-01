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
