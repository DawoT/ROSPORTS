import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from '@/infrastructure/database/schema';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL?.replace(':6543', ':5432');

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment');
}

let testClient: Client | null = null;
let testDbInstance: NodePgDatabase<typeof schema> | null = null;

export async function getTestDb(): Promise<{ db: NodePgDatabase<typeof schema>; client: Client }> {
    if (testDbInstance && testClient) {
        return { db: testDbInstance, client: testClient };
    }

    const client = new Client({
        connectionString,
        connectionTimeoutMillis: 10000,
    });

    client.on('error', (err) => {
        console.error('🔥 Postgres Client Error:', err);
    });

    await client.connect();

    // Start Transaction to pin connection to backend (Supabase Transaction Mode fix)
    await client.query('BEGIN');

    // Enforce schema
    await client.query('SET search_path TO testing');

    // Debug: Verify Context
    const debugRes = await client.query('SHOW search_path');
    const tableCheck = await client.query(
        "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'testing'"
    );
    console.log(
        `🔌 DB Helper Connected. Search Path: ${debugRes.rows[0].search_path}, Testing Tables: ${tableCheck.rows[0].count}`
    );

    testClient = client;
    testDbInstance = drizzle(client, { schema });

    return { db: testDbInstance, client };
}

export async function cleanupTestDb(): Promise<void> {
    const { db } = await getTestDb();
    // Truncate tables for cleanup
    await db.execute(
        'TRUNCATE TABLE inventory_stock, order_items, orders, product_variants, products, customers, locations CASCADE'
    );
}

export async function closeTestDb(): Promise<void> {
    if (testClient) {
        try {
            await testClient.query('ROLLBACK');
        } catch (e) {
            console.error('Error rolling back test transaction:', e);
        }
        await testClient.end();
        testClient = null;
        testDbInstance = null;
    }
}
