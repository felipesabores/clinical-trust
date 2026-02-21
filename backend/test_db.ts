import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL
    });
    try {
        await client.connect();
        console.log('CONNECTED TO DB SUCCESS!');
        const res = await client.query('SELECT NOW()');
        console.log('TIME:', res.rows[0]);
        await client.end();
    } catch (e) {
        console.error('FAILED TO CONNECT:', e);
        process.exit(1);
    }
}
test();
