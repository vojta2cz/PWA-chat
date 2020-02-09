let pg = require('pg');
if (process.env.DATABASE_URL) {
    pg.defaults.ssl = true;
}

let connString = process.env.DATABASE_URL || 'postgresql://postgres:123@localhost:5432/chat';

const Pool = require('pg').Pool;
Pool.Promise = global.Promise;

const pool = new Pool({
    connectionString: connString
});
/*
const pool = new Pool({
    user: 'zcxqmrzczvpmaq',
    host: 'ec2-52-203-160-194.compute-1.amazonaws.com',
    database: 'dqejrfv67n21t',
    password: 'a2d3a40df2d97dc95a21c8cc11b93fd5db95980dc4d7fe73b319f400bf0d673b',
    port: 5432,
    ssl: true,
})
*/

//const db = pool.connection

module.exports = pool