import { query } from '../../database/db';
import { Category } from './models/categoryRepositoryTypes';

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

export const findAll = async (): Promise<Category[]> => {
  const rows = await query<Category>(`SELECT * FROM tb_category`);
  return rows;
};
