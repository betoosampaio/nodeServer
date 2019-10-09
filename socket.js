const auth = require('./middlewares/auth.middleware').socket;

let io;

module.exports = (_io) => {
    io = _io;

    // autenticação
    io.use(auth);

    io.on('connection', function (client) {
        console.log(client.token);
        client.emit('conectado', 'conectado');
        
        client.on('teste', function (dados) {
            client.emit('teste', dados);
        });
    });

}

module.exports.socketsEmit = (event, obj) => {
    io.sockets.emit(event, obj);
}