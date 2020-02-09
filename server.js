const express = require('express')
const bodyParser = require('body-parser')
var cors = require('cors')
var cookieParser = require('cookie-parser');
const withAuth = require('./middleware');
const userRouter = require('./routes/user-router')
const roomRouter = require('./routes/room-router')
const messageRouter = require('./routes/message-router')
//const db = require('../PWA-chat/controllers/user-ctrl')
const utf8 = require('utf8')
const WebSocket = require('ws');


const app = express()
const apiPort = 14761 || process.env.PORT
/*
db.once('open', () => console.log(db.collection('user').name + '::xx'))
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
*/
app.use(cookieParser())
app.use(cors())
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
const wss = new WebSocket.Server({ port: 3030 });
var idName = "";

wss.on('connection', function connection(ws, req) {
    const ur = req.url
    idName = ur.split('=')[1]
    ws.id = idName
    ws.on('message', function incoming(data) {
        const str = data.split(' ')
        wss.clients.forEach(function each(client) {
            if (client.id == str[1]) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(str[0] + " " + str[2]);
                }
            }
        });
    });
});

/*
app.get('/', (req, res) => {
    res.send('Ahoj svìte!')
})
*/
/*
app.get('/user/:mail', db.getUserById)
app.get('/list', db.getUsers)
app.get('/userName/:name', db.getUserByName)
app.post('/user', db.InsertUser)
app.delete('/user/:id', db.DeleteUser)
*/

app.use('/api', userRouter)
app.use('/api', roomRouter)
app.use('/api', messageRouter)

app.get('/checkToken', withAuth, function (req, res) {
    res.sendStatus(200)
})

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))