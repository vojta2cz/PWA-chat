const Pool = require('pg').Pool

//Pool.Promise = global.Promise;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'chat',
    password: '123',
    port: 5432,
})


//const db = pool.connection

module.exports = pool