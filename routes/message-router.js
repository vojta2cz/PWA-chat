const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
var cookieParser = require('cookie-parser')
const withAuth = require('../middleware');

const MessageCtrl = require('../controllers/message-ctrl')



const router = express()
router.use(cookieParser())
router.use(bodyParser.json())
router.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

router.post('/messages', MessageCtrl.getMessages)
router.post('/message', MessageCtrl.newMessage)
router.delete('/deleteMessage', MessageCtrl.deleteMessage)

module.exports = router