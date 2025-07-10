import { query } from '../../database/db';
interface RoleFound {
  id: string;
}

export const findIdByName = async (name: string): Promise<RoleFound | ''> => {
  const rows = await query(
    `SELECT id  
     FROM tb_role  
     WHERE "name" = $1  
     LIMIT 1;`,
    [name]
  );

  return rows[0].id || '';
};
