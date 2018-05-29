// CONECCION DE SOCKET DEL SERVIDOR

const Chat = require('./models/chat')

let users = { }  // por ahora simula los usuarios conectados en una bd

module.exports = (io) => {
    io.on('connection', async socket => {
        console.log('new user connected');

        let messages = await Chat.find({}).limit(8); // uando se conecta un nuevi usuario puede ver los ultimos 8 mensajes
        socket.emit('load old msgs', messages)

        socket.on('new user', (data, cb) => {
            if (data in users) {
                cb(false);
            } else {
                cb(true)
                socket.nickname = data;
                users[socket.nickname] = socket
                updateNicknames();
            }
        })

        socket.on('send message', async (data, cb) => { // cuando el cliente me envie este mensaje send message 

            var msg = data.trim(); // trim elimina los espacios de mas en un texto
            
            if (msg.substr(0, 3) === '/w ') { // si el mensaje que estas enviando, al inicio tiene 3 caracteres  /w_ 
                msg = msg.substr(3); // el mensaje ahora es lo que sigue desde el indice 3
                var index = msg.indexOf(' '); // determinamos el indice de donde esta ese espacio en blanco 
                if(index !== -1) {
                    var name = msg.substring(0, index); // obtenemos el nombre
                    var msg = msg.substring(index + 1); // para que empieze a tomar lo que sigue luego del nombre
                    if (name in users) {
                        users[name].emit('whisper', {
                            msg,
                            nick: socket.nickname  // quien envia el msg
                        })
                    } else { // si el usuario al que le quiero enviar un msg no esta en el chat
                        cb('Error! Please enter a valid user.')    
                    }
                } else { // si el index es -1, osea no escribio un usuario o espacio luego del usuario
                    cb('Error! Please enter a Valid message')
                }
            } else { // si no encuentra los 3 primeros caracteres iguales a /w, osea es un mensaje comun para todos
                var newMsg = new Chat({ // para almacenar en la bd
                    msg,
                    nick: socket.nickname
                })

                await newMsg.save();// para almacenar en la bd

                io.sockets.emit('new message', {
                    msg: data,
                    nick: socket.nickname
                })
            }
        })

        socket.on('disconnect', data => { // disconnect ya viene incluido en socket
            if(!socket.nickname) return;
            delete users[socket.nickname];
            updateNicknames();
        })

        function updateNicknames() {
            io.sockets.emit('usernames', Object.keys(users)); // emito un evento llamado username, el cual va a enviar el arreglo de usuarios al usuario
        }

    }) 
}