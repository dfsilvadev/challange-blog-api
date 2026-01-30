/* eslint-disable no-console */
/**
 * Executa todas as migrations em src/database/migrations/ em ordem alfabética.
 * Usa DATABASE_URL do .env (via config).
 * Uso: yarn db:migrate ou npm run db:migrate
 */
import * as fs from 'fs';
import * as path from 'path';

import { Client } from 'pg';

import config from '../utils/config/config';

const MIGRATIONS_DIR = path.join(__dirname, '../database/migrations');

async function runMigrations(): Promise<void> {
  if (!config.databaseUrl) {
    console.error('❌ DATABASE_URL não está definida no .env');
    process.exit(1);
  }

  const client = new Client({ connectionString: config.databaseUrl });

  try {
    await client.connect();
    console.log('📦 Conectado ao banco. Executando migrations...\n');

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'));
    if (files.length === 0) {
      console.log('Nenhum arquivo .sql em', MIGRATIONS_DIR);
      return;
    }

    files.sort();

    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      console.log(`   ▶ ${file}`);
      await client.query(sql);
      console.log(`   ✓ ${file}\n`);
    }

    console.log('✅ Migrations concluídas com sucesso.');
  } catch (err) {
    console.error('❌ Erro ao executar migrations:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
