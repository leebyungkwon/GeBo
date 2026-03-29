const { Client } = require('pg');
const fs = require('fs');

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
        const res = await client.query("SELECT email, role, length(password_hash) as pwd_len, password_hash FROM admin_user WHERE email='admin1@bo.com'");
        fs.writeFileSync('out.json', JSON.stringify(res.rows, null, 2), 'utf8');
        console.log('Saved to out.json');
    } catch (err) {
        console.error('DB Error:', err.message);
    } finally {
        await client.end();
    }
}

test();
