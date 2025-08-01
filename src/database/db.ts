/* eslint-disable no-console */
import { Client, QueryResultRow as PGQueryResultRow, types } from 'pg';

import config from '../utils/config/config';

types.setTypeParser(1114, (str) => new Date(str + 'Z'));

const client = new Client({
  connectionString: config.databaseUrl
});

if (process.env.NODE_ENV !== 'test') {
  client
    .connect()
    .then(() => console.log('🔥 Connected to the database!'))
    .catch((err) => console.error('Error connecting to database:', err));
}

export async function query<T extends PGQueryResultRow = PGQueryResultRow>(
  query: string,
  values?: unknown[]
): Promise<T[]> {
  try {
    const { rows } = await client.query<T>(query, values);
    return rows;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  }
}
