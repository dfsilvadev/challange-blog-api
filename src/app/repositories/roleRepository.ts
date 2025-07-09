import { query } from '../../database/db';

export const findIdByName = async (name: string): Promise<string | ''> => {
  const result = await query(
    `SELECT id
    FROM tb_role
    WHERE "name" = $1
    LIMIT 1;`,
    [name]
  );

  return result[0]?.id || '';
};
