const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'bo',
    password: '1234',
    port: 5432,
});

client.connect();

client.query('SELECT id, email, name, role FROM admin_users;', (err, res) => {
    if (err) {
        console.error(err);
    } else {
        for (let row of res.rows) {
            console.log(row);
        }
    }
    client.end();
});
