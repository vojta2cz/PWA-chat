const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
var cookieParser = require('cookie-parser')
const withAuth = require('../middleware');

const UserCtrl = require('../controllers/user-ctrl')



const router = express()
router.use(cookieParser())
router.use(bodyParser.json())
router.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
/*router.post('/user', UserCtrl.createUser)
router.put('/user/:id', UserCtrl.updateUser)
router.delete('/user/:id', UserCtrl.deleteUser)*/
router.get('/user/:mail', UserCtrl.getUserById)
router.get('/list/:name', UserCtrl.getUsers)
router.get('/userName/:name', withAuth, UserCtrl.getUserByName)
router.post('/user', UserCtrl.InsertUser)
router.delete('/user/:id',  UserCtrl.DeleteUser)
router.post('/login', UserCtrl.loginUser)

module.exports = router