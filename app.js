const express = require('express')
const app = express()

var http = require('http').Server(app);

var socketio = require('socket.io')


// var app = require('express')();
// var io = require('socket.io');


app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res)=> {
    res.render('index')
})


app.get('/student', (req, res)=> {
    res.render('student')
})

const server = app.listen(process.env.PORT || 4212, () => {
    console.log("server is running")
})







//initialize socket for the server
const io = socketio(server)

io.on('connection', socket => {
    console.log("New user connected")

    socket.username = "Anonymous"

    socket.on('change_username', data => {
        socket.username = data.username
    })


    //handle the new message event
    socket.on('new_message', data => {
        console.log("new message")
        io.sockets.emit('receive_message', {message: data.message, username: socket.username, type:data.type})
    })


    socket.on('typing', data => {
        socket.broadcast.emit('typing', { username: socket.username,text:data.text })
    })

})