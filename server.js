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

// socket server
const server = require('http').Server(app);
const io = require('socket.io')(server);
require('./socket.js')(io);
server.listen(3002);
