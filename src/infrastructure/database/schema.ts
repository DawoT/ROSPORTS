import { pgTable, serial, text, decimal, boolean, timestamp, jsonb, bigint, integer, bigserial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Products Table
 */
export const products = pgTable('products', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    descriptionShort: text('description_short'),
    descriptionLong: text('description_long'),
    // Using decimal with ample precision for currency
    basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
    status: text('status').notNull().default('DRAFT'), // ACTIVE, DRAFT, ARCHIVED
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Product Variants Table
 */
export const productVariants = pgTable('product_variants', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    productId: bigint('product_id', { mode: 'number' }).references(() => products.id),
    sku: text('sku').notNull().unique(),
    size: text('size'),
    color: text('color'),
    priceOverride: decimal('price_override', { precision: 10, scale: 2 }),
    isActive: boolean('is_active').default(true),
});

/**
 * Locations Table (Warehouses/Stores)
 */
export const locations = pgTable('locations', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    code: text('code').notNull().unique(),
    address: text('address'),
    isActive: boolean('is_active').default(true),
});

/**
 * Inventory Stock Table
 * Using Optimistic Locking via 'version' column
 */
export const inventoryStock = pgTable('inventory_stock', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    locationId: integer('location_id').references(() => locations.id),
    variantId: bigint('variant_id', { mode: 'number' }).references(() => productVariants.id),

    quantityOnHand: integer('quantity_on_hand').notNull().default(0),
    quantityReserved: integer('quantity_reserved').notNull().default(0),

    // Optimistic Lock Version
    version: bigint('version', { mode: 'number' }).notNull().default(0),

    lastUpdatedAt: timestamp('last_updated_at').defaultNow(),
});

/**
 * Relations
 */
export const productsRelations = relations(products, ({ many }) => ({
    variants: many(productVariants),
}));

export const variantsRelations = relations(productVariants, ({ one, many }) => ({
    product: one(products, {
        fields: [productVariants.productId],
        references: [products.id],
    }),
    stock: many(inventoryStock),
}));

export const inventoryRelations = relations(inventoryStock, ({ one }) => ({
    variant: one(productVariants, {
        fields: [inventoryStock.variantId],
        references: [productVariants.id],
    }),
    location: one(locations, {
        fields: [inventoryStock.locationId],
        references: [locations.id],
    }),
}));
