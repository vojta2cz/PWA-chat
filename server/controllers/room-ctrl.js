/*const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'chat',
    password: '123',
    port: 5432,
})
*/
const secret = 'mysecretsword'
const pool = require('../db/index')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getRooms = (request, response) => {
    //const token = request.cookies.tokenlogin
    const name = request.params.name
    pool.query('(SELECT name2 AS name FROM rooms WHERE name1 = $1) UNION (SELECT name1 AS name FROM rooms WHERE name2 = $1 ORDER BY name2 ASC)', [name], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


const getRoomById = (request, response) => {
    const id = request.params.id

    pool.query('SELECT name1, name2 FROM rooms WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createRoom = (request, response) => {

    const name1 = request.body.mail1
    const name2 = request.body.mail2

    pool.query('INSERT INTO rooms (name1, name2, status) VALUES ($1, $2, $3)', [name1, name2, 0], function (error, results) {
        if (error) {
            throw error
        }
        else {
            return response.json({ success: true, message: `Pozvánka poslána` })
            //pool.end()
        }
        //response.status(200)
    })
}

const deleteRoom = (request, response) => {

    const name1 = request.body.mail1
    const name2 = request.body.mail2

    pool.query('DELETE FROM rooms WHERE name1 = $1 AND name2 = $2', [name1, name2], function (error, results) {
        if (error) {
            throw error
        }
        else {
            return response.json({ success: true, message: `Chat smazán` })
            //pool.end()
        }
        //response.status(200)
    })
}
module.exports = {
    getRooms,
    getRoomById,
    createRoom,
    deleteRoom,
}
