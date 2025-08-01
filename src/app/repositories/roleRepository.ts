import { query } from '../../database/db';

import { RoleIdFound } from './models/postRepositoryTypes';

export const findIdByName = async (name: string): Promise<RoleIdFound | ''> => {
  const rows = await query(
    `SELECT id
     FROM tb_role
     WHERE "name" = $1
     LIMIT 1;`,
    [name]
  );

  return rows[0].id || '';
};
