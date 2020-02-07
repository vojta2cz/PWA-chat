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

const getMessages = (request, response) => {
    var myPromise = new Promise((resolve, reject) => {
        resolve('successPayload');
        // reject( 'errorPayload' );
    });
    //const token = request.cookies.tokenlogin
    const name1 = request.body.mail1
    const name2 = request.body.mail2
    const status = request.body.status
    var read = 0
    if (status == 0) 
        read = 2
    else
        read = 1
    var id = 0;
    myPromise.then(pool.query('SELECT id FROM rooms WHERE (name1 = $1 OR name2 = $1) AND (name1 = $2 OR name2 = $2)', [name1, name2], function (err, res) {
        if (err) {
            throw err
        }
        else if (res.rowCount != 0) {
            id = res.rows[0].id 
            pool.query('SELECT author, text, time FROM messages WHERE roomid = $1 AND status < $2 ORDER BY time ASC', [id, read], function (error, results) {
                if (error) {
                    throw error
                }
                else {
                    
                    pool.query('UPDATE messages SET status = 1 WHERE roomid = $1 AND author = $2', [id, name2], function (e, r) {
                        response.status(200).json(results.rows)
                    })
                    //pool.end()
                }
            })
        }
    })).finally()
}

const newMessage = (request, response) => {

    var myPromise = new Promise((resolve, reject) => {
        resolve('successPayload');
        // reject( 'errorPayload' );
    });

    const name1 = request.body.mail1
    const name2 = request.body.mail2
    const message = request.body.message
    var id = 0
    myPromise.then(pool.query('SELECT id FROM rooms WHERE ((name1 = $1 OR name2 = $1) AND (name1 = $2 OR name2 = $2))', [name1, name2], function (err, res) {
            if (err) {
                throw err
            }
            else if (res.rowCount > 0) {
                id = res.rows[0].id
            pool.query('INSERT INTO messages (roomid, author, text, status) VALUES ($1, $2, $3, $4)', [id, name1, message, 0], function (error, results) {
                if (error) {
                    throw error
                }
                else {
                    return response.json({ success: true, message: `Zpráva poslána` })
                    //pool.end()
                }
            })
        }
    }))
}

const deleteMessage = (request, response) => {

    const name = request.body.name
    const time = request.body.time
    pool.query('DELETE FROM messages WHERE author = $1 AND time = $2', [name, time], function (error, results) {
        if (error) {
            throw error
        }
        else {
            return response.json({ success: true, message: `Zpráva smazána` })
            //pool.end()
        }
        //response.status(200)
    })
}
module.exports = {
    getMessages,
    deleteMessage,
    newMessage,
}
