import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import {
    products,
    productVariants,
    locations,
    inventoryStock,
    orders,
    orderItems
} from '../src/infrastructure/database/schema';
import { sql } from 'drizzle-orm';

const { Pool } = pg;

async function clearDb(): Promise<void> {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const db = drizzle(pool);

    console.log('🗑️ Clearing database...');

    try {
        // Truncate tables with cascade
        await db.execute(sql`TRUNCATE TABLE ${orderItems} CASCADE`);
        await db.execute(sql`TRUNCATE TABLE ${orders} CASCADE`);
        await db.execute(sql`TRUNCATE TABLE ${inventoryStock} CASCADE`);
        await db.execute(sql`TRUNCATE TABLE ${productVariants} CASCADE`);
        await db.execute(sql`TRUNCATE TABLE ${products} CASCADE`);
        await db.execute(sql`TRUNCATE TABLE ${locations} CASCADE`);

        console.log('✅ Database cleared successfully.');
    } catch (error) {
        console.error('❌ Failed to clear database:', error);
    } finally {
        await pool.end();
    }
}

clearDb();
