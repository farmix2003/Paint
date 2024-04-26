const express = require('express')
const socketIo = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

io.on('connection', socket => {
    console.log("A user connected");

    socket.on('draw', data => {
        socket.broadcast.emit('draw', data)
    })
})

const port = process.env.port || 3000
server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


