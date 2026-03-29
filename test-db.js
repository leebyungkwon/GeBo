const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1234',
    port: 5432,
});

client.connect();

client.query('SELECT datname FROM pg_database;', (err, res) => {
    if (err) {
        console.error(err);
    } else {
        for (let row of res.rows) {
            console.log(row.datname);
        }
    }
    client.end();
});
