import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import {
    inventoryStock,
} from '../src/infrastructure/database/schema';

const { Pool } = pg;

async function fixStock(): Promise<void> {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const db = drizzle(pool);

    console.log('🔧 Fixing stock levels...');

    try {
        // Update all stock to 50 for simplicity
        await db.update(inventoryStock).set({
            quantityOnHand: 50,
            quantityReserved: 0
        });

        console.log('✅ Stock fixed for all variants.');
    } catch (error) {
        console.error('❌ Failed to fix stock:', error);
    } finally {
        await pool.end();
    }
}

fixStock();
