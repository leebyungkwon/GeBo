const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function test() {
    const client = new Client({
        user: 'postgres',
        password: '1234',
        host: 'localhost',
        port: 5432,
        database: 'bo'
    });

    try {
        await client.connect();
        const hash = await bcrypt.hash('admin1234', 10);
        await client.query("UPDATE admin_user SET password_hash = $1 WHERE email = 'admin1@bo.com'", [hash]);
        console.log('Password reset successfully to admin1234');
    } catch (err) {
        console.error('DB Error:', err.message);
    } finally {
        await client.end();
    }
}

test();
