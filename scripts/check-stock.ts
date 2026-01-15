import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { products, productVariants, inventoryStock } from '../src/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

const { Pool } = pg;

async function checkStock(): Promise<void> {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined');
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const db = drizzle(pool);

    console.log('🔍 Checking stock levels...');

    try {
        const results = await db
            .select({
                product: products.name,
                variantId: productVariants.id,
                sku: productVariants.sku,
                stock: inventoryStock.quantityOnHand,
                reserved: inventoryStock.quantityReserved,
            })
            .from(products)
            .innerJoin(productVariants, eq(products.id, productVariants.productId))
            .leftJoin(inventoryStock, eq(productVariants.id, inventoryStock.variantId));

        console.log('Detailed Stock Report:', JSON.stringify(results, null, 2));
        console.log('Total Variants found:', results.length);
        console.log(
            'Variants with missing stock records:',
            results.filter((r) => r.stock === null).length
        );
    } catch (error) {
        console.error('❌ Failed to check stock:', error);
    } finally {
        await pool.end();
    }
}

checkStock();
