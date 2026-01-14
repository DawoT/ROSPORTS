import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

async function testConnection(): Promise<void> {
    console.log('Checking environment...');
    if (!process.env.DATABASE_URL) {
        console.error('No DATABASE_URL');
        return;
    }

    console.log('Connecting...');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 5000,
    });

    try {
        const client = await pool.connect();
        console.log('Connected! Setting search path...');
        await client.query('SET search_path TO testing');
        console.log('Search path set. Querying products...');
        const res = await client.query('SELECT count(*) FROM products');
        console.log('Result:', res.rows[0]);
        client.release();
    } catch (err: unknown) {
        console.error('Connection failed:', err);
    } finally {
        await pool.end();
    }
}

testConnection().catch(console.error);
