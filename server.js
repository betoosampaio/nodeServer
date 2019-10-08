require('dotenv/config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/public', express.static(__dirname + '/public'));

require('./routes.js')(app);

app.listen(3001, () => {
  console.log("Server UP");
});






const server = require('http').Server(app);
const io = require('socket.io')(server);
server.listen(3002);

let restaurante = {
  conexoes: 0,
  mesas: [],
};

io.on('connection', function (client) {
  console.log(client.handshake);
  restaurante.conexoes++;
  io.sockets.emit('atualizacao', restaurante);

  client.on('disconnect', function () {
    restaurante.conexoes--;
    io.sockets.emit('atualizacao', restaurante);
  })

  client.on('mesa/cadastrar', function (dados) {
    restaurante.mesas.push({ numero: dados.n })
    io.sockets.emit('atualizacao', restaurante);
  });
});

