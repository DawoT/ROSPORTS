import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Use process.env.DATABASE_URL
// For production, we should ensure ssl: true or similar options
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
