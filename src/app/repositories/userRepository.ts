import { query } from '../../database/db';

export const existsById = async (id: string): Promise<boolean> => {
  const result = await query<{ exists: boolean }>(
    `SELECT EXISTS (SELECT 1 FROM tb_user WHERE id = $1) AS exists`,
    [id]
  );
  return result[0]?.exists || false;
};

export const findById = async (id: string) => {
  const result = await query(
    `SELECT id, name, email, phone FROM tb_user WHERE id = $1`,
    [id]
  );
  return result[0] || null;
};
