import { query } from '../../database/db';

export const findById = async (id: string): Promise<boolean> => {
  const [row] = await query<{ exists: boolean }>(
    `
    SELECT EXISTS (
      SELECT 1 FROM tb_category WHERE id = $1
    ) AS "exists"
    `,
    [id]
  );
  return !!row?.exists;
};
