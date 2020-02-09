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


const loginUser = (request, response) => {
    const mail = request.body.mail
    const password = request.body.password

    pool.query('SELECT password FROM users WHERE mail = $1', [mail], (error, results) => {
        
        if (results.rowCount > 0) {
            if (bcrypt.compareSync(password, results.rows[0].password)) {
                const payload = { mail };
                const token = jwt.sign(payload, secret, {
                    expiresIn: '1h'
                });
                response.cookie('logintoken', 'mail', { httpOnly: true })
                    .sendStatus(200);
                //return response.json({ success: true, message: `Uživatel pøihlášen` })
            }
            else
                return response.status(201).json({ success: false, message: `Špatné jméno nebo heslo` })
        }
        else
            return response.status(201).json({ success: false, message: `Vyskytla se chyba, opakujte akci` })
        if (error) {
            throw error
        }   
    })
}

const getUsers = (request, response) => {
    //const token = request.cookies.tokenlogin
    const id = request.params.name

    pool.query('SELECT mail, name FROM users WHERE mail != $1 AND mail NOT IN(SELECT name1 FROM rooms WHERE name2 = $1) AND mail NOT IN(SELECT name2 FROM rooms WHERE name1 = $1) ORDER BY name ASC', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


const getUserById = (request, response) => {
    const id = request.params.mail

    pool.query('SELECT mail, name FROM users WHERE mail = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const getUserByName = (request, response) => {
    const id = request.params.name

    pool.query('SELECT mail, name FROM users WHERE name = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const InsertUser = (request, response) => {

    const id = request.body.mail
    const name = request.body.name
    const password = request.body.password

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    pool.query('SELECT mail FROM users WHERE mail = $1', [id], (err, res) => {
        
        if (res.rowCount > 0)
            return response.status(201).json({ success: false, message: `Email už existuje` })
        else {
            pool.query('INSERT INTO users (mail, name, password, status) VALUES ($1, $2, $3, $4)', [id, name, hash, 0], function (error, results) {
                if (error) {
                    throw error
                }
                else {
                    return response.json({ success: true, message: `Uživatel byl vytvoøen` })
                    //pool.end()
                }
                //response.status(200)
            })
        }
        if (error) {
            throw error
        }
    })
}

const DeleteUser = (request, response) => {

    const id = request.params.id

    pool.query('DELETE FROM users WHERE mail = $1', [id], function (error, results) {
        if (error) {
            throw error
        }
        else {
            return response.json({ success: true, message: `Uživatel byl smazán` })
            //pool.end()
        }
        //response.status(200)
    })
}
module.exports = {
    getUsers,
    getUserById,
    getUserByName,
    InsertUser,
    DeleteUser,
    loginUser,
}

/*
const User = require('../model/user-model')

createUser = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Informace nejsou kompletní',
        })
    }

    const user = new User(body)

    if (!user) {
        return res.status(400).json({ success: false, error: err })
    }

    user
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: user._id,
                message: 'Uživatel vytvoøen!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Nastala chyba!',
            })
        })
}

updateUser = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Nejsou k dispozici kompletní údaje',
        })
    }

    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Uživatel nenalezen!',
            })
        }
        user.name = body.name
        user.email = body.email
        user.status = body.status
        user
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: user._id,
                    message: 'Data aktualizována!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Nastala chyba pøi aktualizaci dat!',
                })
            })
    })
}

deleteUser = async (req, res) => {
    await User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `Uživatel nenalezen` })
        }

        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}

getUserById = async (req, res) => {
    await User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `Uživatel nenalezen` })
        }
        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}

getUsers = async (req, res) => {
    await User.find({}, (err, users) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!users.length) {
            return res
                .status(404)
                .json({ success: false, error: `Uživatel nenalezen` })
        }
        return res.status(200).json({ success: true, data: users })
    }).catch(err => console.log(err))
}

getUserByName = async (req, res) => {
    await User.find({ name: req.params.name }, (err, users) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!users.length) {
            return res.status(404).json({success: false, error: `UŽivatel nenalezen`  })
        }
        return res.status(200).json({ succes: true, data: users })
    }).catch(err => console.log(err))
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUserById,
    getUserByName,
}

*/