import dotenv from 'dotenv';

dotenv.config();

interface Config {
  readonly port: number;
  readonly nodeEnv: string;
  readonly databaseUrl: string;
  readonly jwtSecret: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || ''
};

export default config;
