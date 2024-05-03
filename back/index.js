const express = require('express')
const mongoose = require('mongoose')
const { log } = require('console')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const nodemoon = require('nodemon')


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

app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../node_modules/socket.io/client-dist/socket.io.js'));
})

app.use(express.static('public', {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

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


app.get('/', (req, res) => {
    res.status(200).send({ message: 'OK' });
})


const port = process.env.port || 3000
server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


