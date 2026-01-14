import { getTestDb, closeTestDb } from '../src/tests/integration/db-helper';

async function check(): Promise<void> {
    console.log('🔍 Checking tables in "testing" schema...');

    // This helper sets search_path=testing
    console.log(`🔌 Check connecting to: ${process.env.DATABASE_URL?.split('@')[1]}`);
    const { client } = await getTestDb();

    const res = await client.query(`
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'testing'
    `);

    console.table(res.rows);

    await closeTestDb();
}

check().catch(console.error);
