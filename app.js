const express = require('express')
const app = express()

var http = require('http').Server(app);

var socketio = require('socket.io')

require('dotenv').config();





// const server = require('http').Server(app)

const { v4: uuidV4 } = require('uuid')



// var app = require('express')();
// var io = require('socket.io');


app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


app.get('/student', (req, res) => {
    res.sendFile(__dirname + '/student.ejs')
    
})



const port = process.env.PORT

const server = app.listen(port , () => {
    console.log(`server is running ${port}`)








//initialize socket for the server
const io = socketio(server)

io.on('connection', socket => {
    console.log("New user connected")

    socket.username = "Anonymous"

    socket.on('join-room', (ROOM_ID, id) => {
        socket.join(ROOM_ID)
        socket.to(ROOM_ID).broadcast.emit('user-connected', id)

        socket.on('disconnect', () => {
            socket.to(ROOM_ID).broadcast.emit('user-disconnected', id)
        })
    })

    socket.on('change_username', data => {
        socket.username = data.username
    })


    //handle the new message event
    socket.on('new_message', data => {
        console.log("new message")
        io.sockets.emit('receive_message', { message: data.message, username: socket.username, type: data.type })
    })


    socket.on('typing', data => {
        socket.broadcast.emit('typing', { username: socket.username, text: data.text })
    })

})






