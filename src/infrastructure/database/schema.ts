import {
    pgTable,
    serial,
    text,
    decimal,
    boolean,
    timestamp,
    bigint,
    integer,
    bigserial,
    uuid,
    primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// AUTHENTICATION TABLES (NextAuth.js V5 Compatible)
// ============================================

/**
 * Users Table - Core identity table
 * Compatible with NextAuth.js V5 / Auth.js
 */
export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name'),
    email: text('email').notNull().unique(),
    emailVerified: timestamp('email_verified', { mode: 'date' }),
    image: text('image'),
    passwordHash: text('password_hash'), // For credentials provider
    role: text('role').notNull().default('CUSTOMER'), // 'ADMIN' | 'CUSTOMER'
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Accounts Table - OAuth provider accounts
 * Links external OAuth providers (Google, GitHub, etc.) to users
 */
export const accounts = pgTable(
    'accounts',
    {
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        type: text('type').notNull(), // 'oauth' | 'oidc' | 'credentials'
        provider: text('provider').notNull(),
        providerAccountId: text('provider_account_id').notNull(),
        refresh_token: text('refresh_token'),
        access_token: text('access_token'),
        expires_at: integer('expires_at'),
        token_type: text('token_type'),
        scope: text('scope'),
        id_token: text('id_token'),
        session_state: text('session_state'),
    },
    (account) => ({
        compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
    })
);

/**
 * Sessions Table - Database sessions
 * For server-side session management
 */
export const sessions = pgTable('sessions', {
    sessionToken: text('session_token').primaryKey(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
});

/**
 * Verification Tokens Table - Email verification & magic links
 */
export const verificationTokens = pgTable(
    'verification_tokens',
    {
        identifier: text('identifier').notNull(), // email
        token: text('token').notNull(),
        expires: timestamp('expires', { mode: 'date' }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    })
);

// ============================================
// AUTH RELATIONS
// ============================================

export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    sessions: many(sessions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

// ============================================
// E-COMMERCE TABLES
// ============================================


/**
 * Products Table
 */
export const products = pgTable('products', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    descriptionShort: text('description_short'),
    descriptionLong: text('description_long'),
    basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
    status: text('status').notNull().default('DRAFT'),
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
 */
export const inventoryStock = pgTable('inventory_stock', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    locationId: integer('location_id').references(() => locations.id),
    variantId: bigint('variant_id', { mode: 'number' }).references(() => productVariants.id),
    quantityOnHand: integer('quantity_on_hand').notNull().default(0),
    quantityReserved: integer('quantity_reserved').notNull().default(0),
    version: bigint('version', { mode: 'number' }).notNull().default(0),
    lastUpdatedAt: timestamp('last_updated_at').defaultNow(),
});

/**
 * Customers Table
 */
export const customers = pgTable('customers', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    email: text('email').notNull().unique(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name'),
    phone: text('phone'),
    address: text('address'),
    city: text('city'),
    createdAt: timestamp('created_at').defaultNow(),
});

/**
 * Orders Table
 */
export const orders = pgTable('orders', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    orderNumber: text('order_number').notNull().unique(),
    customerId: bigint('customer_id', { mode: 'number' }).references(() => customers.id),
    status: text('status').notNull().default('PENDING'), // PENDING, PAID, SHIPPED, DELIVERED, CANCELLED
    paymentStatus: text('payment_status').notNull().default('UNPAID'), // UNPAID, PAID, REFUNDED
    subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
    taxTotal: decimal('tax_total', { precision: 10, scale: 2 }).notNull().default('0'),
    shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }).notNull().default('0'),
    totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
    shippingAddress: text('shipping_address'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Order Items Table
 */
export const orderItems = pgTable('order_items', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    orderId: bigint('order_id', { mode: 'number' }).references(() => orders.id),
    variantId: bigint('variant_id', { mode: 'number' }).references(() => productVariants.id),
    productName: text('product_name').notNull(),
    sku: text('sku').notNull(),
    quantity: integer('quantity').notNull(),
    unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
    totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
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

export const customersRelations = relations(customers, ({ many }) => ({
    orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
    customer: one(customers, {
        fields: [orders.customerId],
        references: [customers.id],
    }),
    items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    variant: one(productVariants, {
        fields: [orderItems.variantId],
        references: [productVariants.id],
    }),
}));
