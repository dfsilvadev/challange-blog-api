import { Pool, QueryResultRow as PGQueryResultRow, types } from 'pg';
import config from '../utils/config/config';

//Evitar problemas de timezone com o PostgreSQL
types.setTypeParser(1114, (str) => new Date(str + 'Z')); // Tipo TIMESTAMP sem timezone

// Criar pool de conexões
export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 20, // Número de ociosos no pool
  idleTimeoutMillis: 30000, // tempo de ociosidade antes de fechar uma conexão
  connectionTimeoutMillis: 2000 // tempo antes de desistir de uma conexão
});

// Testar conexão
export async function connectToDatabase(): Promise<void> {
  await pool.query('SELECT 1');
}

// Encerrar conexão
export async function disconnectFromDatabase(): Promise<void> {
  await pool.end();
}

// Atualizar pool de conexões
export async function query<T extends PGQueryResultRow = PGQueryResultRow>(
  queryText: string,
  values?: unknown[]
): Promise<T[]> {
  const { rows } = await pool.query<T>(queryText, values);
  return rows;
}
