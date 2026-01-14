import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import {
    products,
    productVariants,
    locations,
    inventoryStock,
} from '../src/infrastructure/database/schema';

const { Pool } = pg;

async function seed(): Promise<void> {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const db = drizzle(pool);

    console.log('🌱 Starting seed...');

    try {
        // 1. Insert Location
        console.log('Creating location...');
        const [location] = await db
            .insert(locations)
            .values({
                name: 'Almacén Principal',
                code: 'WH-001',
                address: 'Lima, Perú',
                isActive: true,
            })
            .returning();

        console.log(`✅ Location created: ${location.code}`);

        // 2. Insert Products
        console.log('Creating products...');

        const productData = [
            {
                name: 'Nike Air Max 270',
                slug: 'nike-air-max-270',
                descriptionShort: 'Zapatillas running con cámara de aire visible',
                descriptionLong:
                    'Las Nike Air Max 270 ofrecen comodidad excepcional con su unidad Air de gran tamaño. Perfectas para el día a día.',
                basePrice: '459.90',
                status: 'ACTIVE',
            },
            {
                name: 'Adidas Ultraboost 22',
                slug: 'adidas-ultraboost-22',
                descriptionShort: 'Máxima amortiguación para corredores',
                descriptionLong:
                    'La tecnología Boost proporciona retorno de energía incomparable. Ideal para entrenamientos intensos.',
                basePrice: '529.00',
                status: 'ACTIVE',
            },
            {
                name: 'Puma RS-X',
                slug: 'puma-rs-x',
                descriptionShort: 'Estilo retro con tecnología moderna',
                descriptionLong:
                    'Diseño llamativo inspirado en los 80s con la comodidad y durabilidad de hoy.',
                basePrice: '389.00',
                status: 'ACTIVE',
            },
        ];

        for (const prod of productData) {
            const [product] = await db.insert(products).values(prod).returning();
            console.log(`✅ Product created: ${product.name}`);

            // 3. Create variants for each product
            const sizes = ['40', '41', '42', '43', '44'];
            for (const size of sizes) {
                const [variant] = await db
                    .insert(productVariants)
                    .values({
                        productId: product.id,
                        sku: `${product.slug.toUpperCase().replace(/-/g, '-')}-${size}`,
                        size: size,
                        color: 'Negro',
                        isActive: true,
                    })
                    .returning();

                // 4. Add inventory for each variant
                await db.insert(inventoryStock).values({
                    locationId: location.id,
                    variantId: variant.id,
                    quantityOnHand: Math.floor(Math.random() * 20) + 5, // 5-25 units
                    quantityReserved: 0,
                    version: 0,
                });
            }
            console.log(`  ↳ Created 5 variants with inventory`);
        }

        console.log('\n🎉 Seed completed successfully!');
        console.log(`📦 Created ${productData.length} products with variants and inventory.`);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
