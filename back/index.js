const express = require('express')
const socketIo = require('socket.io')
const http = require('http')
const mongoose = require('mongoose')
const { log } = require('console')
const app = express()
const server = http.createServer(app)
const io = socketIo(server)


mongoose.connect('mongodb+srv://ffarrux386:WkQcKzqtjqdwr0iV@cluster0.v5m9man.mongodb.net/?retryWrites=true&w=majority&appName=drawing')

const db = mongoose.connection

const drawingSchema = new mongoose.Schema({
    tool: String,
    color: String,
    brushWidth: Number,
    startX: Number,
    startY: Number,
    endX: Number,
    endY: Number,
})

if (db) {
    console.log("Connected to Mongoose");
}
const Drawing = mongoose.model('Drawing', drawingSchema)

io.on('connection', socket => {
    console.log("A user connected");

    socket.on('joinBoard', boardId => {
        socket.join(boardId)

        Drawing.find({ boardId }, (err, drawings) => {
            if (err) {
                console.log(err)
            } else {
                socket.emit('drawings', drawings)
            }
        })
    })

    socket.on('draw', async (data, boardId) => {
        socket.to(boardId).emit('draw', data)
        try {
            const drawing = new Drawing({ ...data, boardId })
            await drawing.save()
        } catch (err) {
            console.log("Error saving drawing: ", err)
        }
    })

    socket.on('disconnect', () => {
        console.log("A user disconnected");
    })
})



const port = process.env.port || 3000
server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


