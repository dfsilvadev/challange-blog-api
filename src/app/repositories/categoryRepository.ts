import { query } from '../../database/db';

export const findById = async (id: string): Promise<boolean> => {
  const result = await query<{ exists: boolean }>(
    `
    SELECT EXISTS (
      SELECT 1 FROM tb_category WHERE id = $1
    ) AS "exists"
    `,
    [id]
  );
  return !!result[0]?.exists;
};
