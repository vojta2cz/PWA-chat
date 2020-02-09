const Pool = require('pg').Pool

//Pool.Promise = global.Promise;

const pool = new Pool({
    user: 'zcxqmrzczvpmaq',
    host: 'ec2-52-203-160-194.compute-1.amazonaws.com',
    database: 'dqejrfv67n21t',
    password: 'a2d3a40df2d97dc95a21c8cc11b93fd5db95980dc4d7fe73b319f400bf0d673b',
    port: 5432,
})


//const db = pool.connection

module.exports = pool