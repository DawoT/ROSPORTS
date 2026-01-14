import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function setupTestDb(): Promise<void> {
    console.log('🔄 Setting up Integration Test Database (Schema: testing)...');

    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL is not defined in .env');
        process.exit(1);
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL?.replace(':6543', ':5432'),
    });
    console.log(
        `🔌 Setup connecting to: ${process.env.DATABASE_URL?.replace(':6543', ':5432').split('@')[1]}`
    );

    try {
        await client.connect();

        // 1. Reset Schema
        console.log('🗑️ Dropping existing testing schema...');
        await client.query('DROP SCHEMA IF EXISTS testing CASCADE');
        await client.query('CREATE SCHEMA testing');

        // 2. Set search path
        await client.query('SET search_path TO testing');

        // Verify search path
        const res = await client.query('SHOW search_path');
        console.log('🔍 Current search_path:', res.rows[0].search_path);

        // 3. Apply Migrations
        const drizzleDir = path.join(process.cwd(), 'drizzle');
        const migrationFiles = fs
            .readdirSync(drizzleDir)
            .filter((file) => file.endsWith('.sql'))
            .sort();

        for (const file of migrationFiles) {
            console.log(`📦 Processing migration: ${file}`);
            const migrationPath = path.join(drizzleDir, file);
            let migrationSql = fs.readFileSync(migrationPath, 'utf-8');

            // Sanitize SQL
            migrationSql = migrationSql.replace(/"public"\./g, '');

            // Split statements
            const statements = migrationSql.split('--> statement-breakpoint');

            let count = 0;
            for (const statement of statements) {
                const sql = statement.trim();
                if (sql) {
                    await client.query(sql);
                    count++;
                }
            }
            console.log(`   Trace: Applied ${count} statements from ${file}`);
        }

        // 7. Verify inline
        const verifyRes = await client.query(
            "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'testing'"
        );
        console.log(`✅ Tables created in 'testing' (pre-commit): ${verifyRes.rows[0].count}`);

        await client.query('COMMIT');
        console.log('💾 Committed transaction');

        console.log('✅ Test Database Setup Complete!');
    } catch (err) {
        console.error('❌ Setup Failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

setupTestDb();
