const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
var cookieParser = require('cookie-parser')
const withAuth = require('../middleware');

const RoomCtrl = require('../controllers/room-ctrl')



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
router.get('/room/:id', RoomCtrl.getRoomById)
router.get('/rooms/:name', RoomCtrl.getRooms)
router.post('/room', RoomCtrl.createRoom)
router.post('/deleteRoom', RoomCtrl.deleteRoom)

module.exports = router