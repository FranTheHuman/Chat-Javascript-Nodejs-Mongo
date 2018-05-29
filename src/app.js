const http = require('http')

const mongoose = require('mongoose')
const path = require('path')
const soketIo = require('socket.io')

const express = require('express')

const app = express()
const server = http.createServer(app)
const io = soketIo.listen(server) //gracias a este io voy a poder enviar y recibir mensajes desde el cliente y el servidor

const moongoose = require('mongoose')

moongoose.connect('mongodb://localhost/chatDB')
    .then(db => console.log('Db is connected'))
    .catch(err => console.log(err))

require('./socket')(io);

app.set('port', process.env.PORT || 3000)

app.use(express.static(path.join(__dirname, 'public')))

server.listen(app.get('port'), () => {
    console.log('Server on port ', app.get('port'))
})